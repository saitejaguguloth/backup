/**
 * Personalization Engine
 * 
 * Intelligent personalization based on user behavior, preferences, and context.
 * Provides smart suggestions, time-aware content, and adaptive UI.
 */

import ActivityService from './activityService';

export interface UserPreferences {
    favoriteMode?: 'sketch' | 'text' | 'existing' | 'examples';
    modeUsageCount: Record<string, number>;
    dismissedSuggestions: string[];
    completedOnboarding: boolean;
}

export interface SmartSuggestion {
    id: string;
    type: 'action' | 'tip' | 'encouragement';
    title: string;
    description: string;
    action?: {
        label: string;
        route: string;
    };
    priority: number;
}

class PersonalizationEngine {
    private static instance: PersonalizationEngine;
    private activityService: ActivityService;

    private constructor() {
        this.activityService = ActivityService.getInstance();
    }

    static getInstance(): PersonalizationEngine {
        if (!PersonalizationEngine.instance) {
            PersonalizationEngine.instance = new PersonalizationEngine();
        }
        return PersonalizationEngine.instance;
    }

    /**
     * Get time-aware greeting message
     */
    getGreeting(userName?: string): string {
        const timeContext = this.activityService.getTimeContext();
        const name = userName ? `, ${userName}` : '';

        switch (timeContext) {
            case 'morning':
                return `Good morning${name}`;
            case 'afternoon':
                return `Good afternoon${name}`;
            case 'evening':
                return `Good evening${name}`;
            case 'night':
                return `Working late${name}?`;
            default:
                return `Welcome back${name}`;
        }
    }

    /**
     * Get contextual sub-greeting based on user state
     */
    getSubGreeting(): string {
        const stats = this.activityService.getUserStats();
        const timeContext = this.activityService.getTimeContext();
        const isPowerUser = this.activityService.isPowerUser();

        // New user
        if (stats.totalSessions <= 1) {
            return "Let's create something amazing.";
        }

        // Streak celebration
        if (stats.streakDays >= 7) {
            return `🔥 ${stats.streakDays} day streak! You're on fire.`;
        } else if (stats.streakDays >= 3) {
            return `${stats.streakDays} days in a row. Keep it up!`;
        }

        // Time-based messages
        if (timeContext === 'morning') {
            return 'Ready to start creating?';
        } else if (timeContext === 'night') {
            return 'The best ideas come late.';
        }

        // Power user
        if (isPowerUser) {
            return `${stats.totalCreations} creations and counting.`;
        }

        return 'What will you build today?';
    }

    /**
     * Generate smart suggestions based on user behavior
     */
    getSuggestions(): SmartSuggestion[] {
        const stats = this.activityService.getUserStats();
        const preferences = this.getPreferences();
        const suggestions: SmartSuggestion[] = [];

        // New user onboarding
        if (stats.totalSessions <= 1 && !preferences.completedOnboarding) {
            suggestions.push({
                id: 'onboarding_sketch',
                type: 'action',
                title: 'Start with a sketch',
                description: 'Upload or draw your idea to see the magic happen',
                action: {
                    label: 'Try it now',
                    route: '/studio?mode=sketch',
                },
                priority: 10,
            });
        }

        // Returning user with favorite mode
        if (preferences.favoriteMode && stats.totalSessions > 3) {
            const modeLabels = {
                sketch: 'sketching',
                text: 'text descriptions',
                existing: 'refining designs',
                examples: 'exploring examples',
            };

            suggestions.push({
                id: 'continue_favorite',
                type: 'action',
                title: 'Continue where you excel',
                description: `You're great with ${modeLabels[preferences.favoriteMode]}`,
                action: {
                    label: 'Start creating',
                    route: `/studio?mode=${preferences.favoriteMode}`,
                },
                priority: 8,
            });
        }

        // Streak encouragement
        if (stats.streakDays > 0 && stats.streakDays < 7) {
            suggestions.push({
                id: 'streak_motivation',
                type: 'encouragement',
                title: `Day ${stats.streakDays + 1} awaits`,
                description: 'Keep your creative momentum going',
                priority: 7,
            });
        }

        // Time-based suggestions
        const timeContext = this.activityService.getTimeContext();
        if (timeContext === 'morning' && stats.totalCreations > 0) {
            suggestions.push({
                id: 'morning_boost',
                type: 'tip',
                title: 'Morning creativity boost',
                description: 'Morning sessions tend to be most productive',
                priority: 6,
            });
        }

        // Power user tips
        if (this.activityService.isPowerUser() && !preferences.dismissedSuggestions.includes('keyboard_shortcuts')) {
            suggestions.push({
                id: 'keyboard_shortcuts',
                type: 'tip',
                title: 'Pro tip: Keyboard shortcuts',
                description: 'Press ? to see all shortcuts and speed up your workflow',
                priority: 5,
            });
        }

        // Filter dismissed suggestions
        const filtered = suggestions.filter(
            s => !preferences.dismissedSuggestions.includes(s.id)
        );

        // Sort by priority
        return filtered.sort((a, b) => b.priority - a.priority);
    }

    /**
     * Track mode usage
     */
    trackModeUsage(mode: string): void {
        const preferences = this.getPreferences();
        preferences.modeUsageCount[mode] = (preferences.modeUsageCount[mode] || 0) + 1;

        // Update favorite mode
        const maxMode = Object.entries(preferences.modeUsageCount)
            .sort(([, a], [, b]) => b - a)[0];

        if (maxMode) {
            preferences.favoriteMode = maxMode[0] as any;
        }

        this.savePreferences(preferences);
    }

    /**
     * Dismiss a suggestion
     */
    dismissSuggestion(suggestionId: string): void {
        const preferences = this.getPreferences();
        if (!preferences.dismissedSuggestions.includes(suggestionId)) {
            preferences.dismissedSuggestions.push(suggestionId);
            this.savePreferences(preferences);
        }
    }

    /**
     * Mark onboarding as complete
     */
    completeOnboarding(): void {
        const preferences = this.getPreferences();
        preferences.completedOnboarding = true;
        this.savePreferences(preferences);
    }

    /**
     * Get user preferences
     */
    getPreferences(): UserPreferences {
        if (typeof window === 'undefined') {
            return {
                modeUsageCount: {},
                dismissedSuggestions: [],
                completedOnboarding: false,
            };
        }

        const stored = localStorage.getItem('napkin_preferences');
        if (stored) {
            return JSON.parse(stored);
        }

        return {
            modeUsageCount: {},
            dismissedSuggestions: [],
            completedOnboarding: false,
        };
    }

    /**
     * Get recommended creation mode
     */
    getRecommendedMode(): string | null {
        const preferences = this.getPreferences();
        return preferences.favoriteMode || null;
    }

    /**
     * Private: Save preferences to localStorage
     */
    private savePreferences(preferences: UserPreferences): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem('napkin_preferences', JSON.stringify(preferences));
    }
}

export default PersonalizationEngine;
