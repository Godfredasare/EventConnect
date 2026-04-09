// ============================================================
// EventConnect GH – useRealtime (Supabase Realtime)
// ============================================================
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface RealtimeSubscriptionOptions {
  table: string;
  filter?: string; // e.g., 'id=eq.123'
  event?: RealtimeEvent;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  onChange?: (payload: any) => void;
  enabled?: boolean;
}

export function useRealtime({
  table,
  filter,
  event = '*',
  onInsert,
  onUpdate,
  onDelete,
  onChange,
  enabled = true,
}: RealtimeSubscriptionOptions) {
  const channelRef = useRef<any>(null);

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      cleanup();
      return;
    }

    const channelName = `realtime-${table}-${filter || 'all'}`;

    const channel = supabase
      .channel(channelName, {
        config: {
          broadcast: { self: false },
          presence: { key: '' },
        },
      })
      .on(
        'postgres_changes' as any,
        {
          event: event as any,
          schema: 'public',
          table,
          filter: filter || undefined,
        },
        (payload: any) => {
          switch (payload.eventType) {
            case 'INSERT':
              onInsert?.(payload);
              break;
            case 'UPDATE':
              onUpdate?.(payload);
              break;
            case 'DELETE':
              onDelete?.(payload);
              break;
            default:
              break;
          }
          onChange?.(payload);
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          // Successfully subscribed
        }
        if (status === 'CHANNEL_ERROR') {
          console.error(`Realtime channel error for ${table}`);
        }
      });

    channelRef.current = channel;

    return cleanup;
  }, [table, filter, event, enabled, onInsert, onUpdate, onDelete, onChange, cleanup]);
}

// ---------- Presence (online status) ----------

export function usePresence(userId: string | undefined, room: string = 'online-users') {
  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel(room, {
      config: {
        presence: { key: userId },
      },
    });

    channel.on('presence', { event: 'sync' }, () => {
      // Presence state synchronized
    });

    channel.subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
        });
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, room]);
}
