/**
 * useActivity Hook
 * 
 * React hook for accessing activity tracking functionality.
 * Provides real-time session stats and event tracking.
 */

import { useState, useEffect, useCallback } from 'react';
import ActivityService, { UserSession, UserStats } from '@/lib/activityService';

export function useActivity(userId?: string) {
    const [session, setSession] = useState<UserSession | null>(null);
    const [sessionDuration, setSessionDuration] = useState(0);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isTracking, setIsTracking] = useState(false);

    const activityService = ActivityService.getInstance();

    // Start tracking session
    useEffect(() => {
        if (userId && !isTracking) {
            activityService.startSession(userId);
            setIsTracking(true);
            updateState();
        }

        return () => {
            if (isTracking) {
                activityService.endSession();
            }
        };
    }, [userId]);

    // Update session duration every second
    useEffect(() => {
        if (!isTracking) return;

        const interval = setInterval(() => {
            setSessionDuration(activityService.getSessionDuration());
            updateState();
        }, 1000);

        return () => clearInterval(interval);
    }, [isTracking]);

    const updateState = () => {
        setSession(activityService.getCurrentSession());
        setStats(activityService.getUserStats());
    };

    const trackEvent = useCallback((
        type: 'page_view' | 'click' | 'creation' | 'interaction',
        data?: Record<string, any>
    ) => {
        activityService.trackEvent(type, data);
        updateState();
    }, []);

    const formatDuration = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    };

    return {
        session,
        sessionDuration,
        sessionDurationFormatted: formatDuration(sessionDuration),
        stats,
        trackEvent,
        isTracking,
        timeContext: activityService.getTimeContext(),
        isPowerUser: activityService.isPowerUser(),
    };
}
