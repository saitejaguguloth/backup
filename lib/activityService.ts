/**
 * Activity Tracking Service
 * 
 * Real-time user activity tracking with local storage persistence.
 * Monitors user sessions, interactions, and behavior patterns.
 */

export interface UserSession {
    userId: string;
    sessionId: string;
    startTime: number;
    lastActive: number;
    totalInteractions: number;
    pageViews: number;
    actionsPerformed: string[];
}

export interface ActivityEvent {
    type: 'page_view' | 'click' | 'creation' | 'interaction';
    timestamp: number;
    data?: Record<string, any>;
}

export interface UserStats {
    totalSessions: number;
    totalTimeSpent: number; // milliseconds
    lastVisit: number;
    streakDays: number;
    totalCreations: number;
    favoriteMode?: string;
}

class ActivityService {
    private static instance: ActivityService;
    private currentSession: UserSession | null = null;
    private activityLog: ActivityEvent[] = [];
    private updateInterval: NodeJS.Timeout | null = null;

    private constructor() {
        this.loadFromStorage();
    }

    static getInstance(): ActivityService {
        if (!ActivityService.instance) {
            ActivityService.instance = new ActivityService();
        }
        return ActivityService.instance;
    }

    /**
     * Start tracking a new session
     */
    startSession(userId: string): void {
        if (typeof window === 'undefined') return;

        const now = Date.now();

        this.currentSession = {
            userId,
            sessionId: `session_${now}`,
            startTime: now,
            lastActive: now,
            totalInteractions: 0,
            pageViews: 1,
            actionsPerformed: [],
        };

        // Update last active timestamp every 5 seconds
        this.updateInterval = setInterval(() => {
            this.updateLastActive();
        }, 5000);

        this.saveToStorage();
        this.updateUserStats();
    }

    /**
     * End the current session
     */
    endSession(): void {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }

        if (this.currentSession) {
            this.saveToStorage();
            this.currentSession = null;
        }
    }

    /**
     * Track a user event
     */
    trackEvent(type: ActivityEvent['type'], data?: Record<string, any>): void {
        const event: ActivityEvent = {
            type,
            timestamp: Date.now(),
            data,
        };

        this.activityLog.push(event);

        if (this.currentSession) {
            this.currentSession.totalInteractions++;
            this.currentSession.lastActive = Date.now();

            if (type === 'creation') {
                this.currentSession.actionsPerformed.push('creation');
                this.updateUserStats();
            }
        }

        // Keep only last 100 events in memory
        if (this.activityLog.length > 100) {
            this.activityLog = this.activityLog.slice(-100);
        }

        this.saveToStorage();
    }

    /**
     * Get current session duration in seconds
     */
    getSessionDuration(): number {
        if (!this.currentSession) return 0;
        return Math.floor((Date.now() - this.currentSession.startTime) / 1000);
    }

    /**
     * Get current session data
     */
    getCurrentSession(): UserSession | null {
        return this.currentSession;
    }

    /**
     * Get user statistics
     */
    getUserStats(): UserStats {
        if (typeof window === 'undefined') {
            return {
                totalSessions: 0,
                totalTimeSpent: 0,
                lastVisit: 0,
                streakDays: 0,
                totalCreations: 0,
            };
        }

        const stored = localStorage.getItem('napkin_user_stats');
        if (stored) {
            return JSON.parse(stored);
        }

        return {
            totalSessions: 0,
            totalTimeSpent: 0,
            lastVisit: 0,
            streakDays: 0,
            totalCreations: 0,
        };
    }

    /**
     * Get time-of-day context
     */
    getTimeContext(): 'morning' | 'afternoon' | 'evening' | 'night' {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    }

    /**
     * Get recent activity events
     */
    getRecentActivity(limit: number = 10): ActivityEvent[] {
        return this.activityLog.slice(-limit);
    }

    /**
     * Check if user is a power user (based on activity)
     */
    isPowerUser(): boolean {
        const stats = this.getUserStats();
        return stats.totalSessions > 10 || stats.totalCreations > 5;
    }

    /**
     * Private: Update last active timestamp
     */
    private updateLastActive(): void {
        if (this.currentSession) {
            this.currentSession.lastActive = Date.now();
            this.saveToStorage();
        }
    }

    /**
     * Private: Update user statistics
     */
    private updateUserStats(): void {
        if (typeof window === 'undefined') return;

        const stats = this.getUserStats();
        const now = Date.now();

        // Check for streak
        const lastVisitDate = new Date(stats.lastVisit).setHours(0, 0, 0, 0);
        const todayDate = new Date(now).setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((todayDate - lastVisitDate) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
            // Consecutive day
            stats.streakDays++;
        } else if (daysDiff > 1) {
            // Streak broken
            stats.streakDays = 1;
        }
        // If daysDiff === 0, same day, keep streak

        stats.totalSessions++;
        stats.lastVisit = now;

        // Count creations from current session
        if (this.currentSession) {
            const creationCount = this.currentSession.actionsPerformed.filter(
                action => action === 'creation'
            ).length;
            stats.totalCreations += creationCount;
        }

        localStorage.setItem('napkin_user_stats', JSON.stringify(stats));
    }

    /**
     * Private: Save to localStorage
     */
    private saveToStorage(): void {
        if (typeof window === 'undefined') return;

        if (this.currentSession) {
            localStorage.setItem('napkin_current_session', JSON.stringify(this.currentSession));
        }
        localStorage.setItem('napkin_activity_log', JSON.stringify(this.activityLog));
    }

    /**
     * Private: Load from localStorage
     */
    private loadFromStorage(): void {
        if (typeof window === 'undefined') return;

        try {
            const sessionData = localStorage.getItem('napkin_current_session');
            if (sessionData) {
                this.currentSession = JSON.parse(sessionData);
            }

            const logData = localStorage.getItem('napkin_activity_log');
            if (logData) {
                this.activityLog = JSON.parse(logData);
            }
        } catch (error) {
            console.warn('Failed to load activity data from storage:', error);
        }
    }
}

export default ActivityService;
