"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Hook for fetching and managing a list of users.
 *
 * @example
 * const { users, isLoading, pagination } = useUsers({ page: 1, pageSize: 20 });
 */
export function useUsers({
  page = 1,
  pageSize = 10,
  search,
}: {
  page?: number;
  pageSize?: number;
  search?: string;
} = {}) {
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page,
    pageSize,
    totalPages: 0,
  });

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (search) params.set("search", search);

      const response = await fetch(`/api/users?${params}`);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.data ?? []);
      setPagination(data.pagination ?? { total: 0, page, pageSize, totalPages: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    pagination,
    refetch: fetchUsers,
  };
}
