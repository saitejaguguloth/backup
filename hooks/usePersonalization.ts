/**
 * usePersonalization Hook
 * 
 * React hook for accessing personalization features.
 * Provides smart suggestions, greetings, and preference management.
 */

import { useState, useEffect, useCallback } from 'react';
import PersonalizationEngine, { SmartSuggestion, UserPreferences } from '@/lib/personalizationEngine';

export function usePersonalization(userName?: string) {
    const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
    const [preferences, setPreferences] = useState<UserPreferences | null>(null);
    const [greeting, setGreeting] = useState('');
    const [subGreeting, setSubGreeting] = useState('');

    const personalizationEngine = PersonalizationEngine.getInstance();

    // Load initial data
    useEffect(() => {
        updatePersonalization();
    }, [userName]);

    const updatePersonalization = () => {
        setGreeting(personalizationEngine.getGreeting(userName));
        setSubGreeting(personalizationEngine.getSubGreeting());
        setSuggestions(personalizationEngine.getSuggestions());
        setPreferences(personalizationEngine.getPreferences());
    };

    const trackModeUsage = useCallback((mode: string) => {
        personalizationEngine.trackModeUsage(mode);
        updatePersonalization();
    }, []);

    const dismissSuggestion = useCallback((suggestionId: string) => {
        personalizationEngine.dismissSuggestion(suggestionId);
        updatePersonalization();
    }, []);

    const completeOnboarding = useCallback(() => {
        personalizationEngine.completeOnboarding();
        updatePersonalization();
    }, []);

    const recommendedMode = personalizationEngine.getRecommendedMode();

    return {
        greeting,
        subGreeting,
        suggestions,
        preferences,
        recommendedMode,
        trackModeUsage,
        dismissSuggestion,
        completeOnboarding,
    };
}
