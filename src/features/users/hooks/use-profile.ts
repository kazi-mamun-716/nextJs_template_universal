"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/features/auth/hooks/use-session";

/**
 * Hook for fetching and updating the current user's profile.
 *
 * @example
 * const { profile, isLoading, updateProfile } = useProfile();
 */
export function useProfile() {
  const { user } = useSession();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/users/profile");
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfile(data.data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
    updateProfile: setProfile,
  };
}
