// ============================================================
// EventConnect GH – useAppQuery (React Query Wrapper)
// ============================================================
import { useQuery as useTanStackQuery, useMutation as useTanStackMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib';

type QueryKey = readonly (string | number | undefined | null)[];

interface SupabaseQueryOptions<T> {
  queryKey: QueryKey;
  table: string;
  select?: string;
  filter?: Record<string, any>;
  single?: boolean;
  orderBy?: { column: string; ascending?: boolean };
  page?: number;
  perPage?: number;
  enabled?: boolean;
}

export function useAppQuery<T = any>({
  queryKey,
  table,
  select = '*',
  filter = {},
  single = false,
  orderBy,
  page,
  perPage = 20,
  enabled = true,
}: SupabaseQueryOptions<T>) {
  let query = supabase.from(table).select(select, single ? undefined : { count: 'estimated' });

  // Apply filters
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query = query.eq(key, value);
    }
  });

  // Apply ordering
  if (orderBy) {
    query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });
  }

  // Apply pagination
  if (page !== undefined) {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);
  }

  return useTanStackQuery({
    queryKey,
    queryFn: async () => {
      const { data, error, count } = await query;
      if (error) throw error;

      if (single) return data as T;
      return { data: data as T[], count: count ?? 0 };
    },
    enabled,
  });
}

interface MutationOptions<TVariables, TData = any> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  invalidateKeys?: QueryKey[];
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
}

export function useAppMutation<TVariables = void, TData = any>({
  mutationFn,
  invalidateKeys,
  onSuccess,
  onError,
}: MutationOptions<TVariables, TData>) {
  const queryClient = useQueryClient();

  return useTanStackMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      if (invalidateKeys) {
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key as string[] });
        });
      }
      onSuccess?.(data, variables);
    },
    onError,
  });
}

// ---------- Preset Query Hooks ----------

export function useVendorBySlug(slug: string) {
  return useAppQuery<any>({
    queryKey: ['vendor', slug],
    table: 'vendors',
    filter: { slug },
    single: true,
    enabled: !!slug,
  });
}

export function useBookings(userId: string | undefined, status?: string) {
  const filter: Record<string, any> = {};
  if (userId) filter.customer_id = userId;
  if (status) filter.status = status;

  return useAppQuery<any>({
    queryKey: ['bookings', userId, status],
    table: 'bookings',
    filter,
    orderBy: { column: 'created_at', ascending: false },
    enabled: !!userId,
  });
}

export function useConversations(userId: string | undefined) {
  return useAppQuery<any>({
    queryKey: ['conversations', userId],
    table: 'conversations',
    filter: userId ? { participant1_id: userId } : undefined,
    orderBy: { column: 'updated_at', ascending: false },
    enabled: !!userId,
  });
}

export function useMessages(conversationId: string | undefined) {
  return useAppQuery<any>({
    queryKey: ['messages', conversationId],
    table: 'messages',
    filter: conversationId ? { conversation_id: conversationId } : undefined,
    orderBy: { column: 'created_at', ascending: true },
    perPage: 50,
    enabled: !!conversationId,
  });
}

export function useSavedVendors(userId: string | undefined) {
  return useAppQuery<any>({
    queryKey: ['saved_vendors', userId],
    table: 'saved_vendors',
    filter: userId ? { user_id: userId } : undefined,
    orderBy: { column: 'created_at', ascending: false },
    enabled: !!userId,
  });
}

export function useVendorServices(vendorId: string | undefined) {
  return useAppQuery<any>({
    queryKey: ['vendor_services', vendorId],
    table: 'vendor_services',
    filter: vendorId ? { vendor_id: vendorId, is_active: true } : undefined,
    orderBy: { column: 'name', ascending: true },
    enabled: !!vendorId,
  });
}
