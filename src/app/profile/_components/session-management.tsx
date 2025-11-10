'use client';

import type { Session } from 'better-auth';
import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button';
import { authClient } from '@/lib/auth/auth-client';
import { useRouter } from 'next/navigation';
import { SessionCard } from './session-card';
import { Card, CardContent } from '@/components/ui/card';

export function SessionManagement({
  sessions,
  currentSessionToken,
}: {
  sessions: Session[];
  currentSessionToken: string;
}) {
  const router = useRouter();
  const currentSession = sessions.find((session) => session.token === currentSessionToken);
  const otherSessions = sessions.filter((session) => session.token !== currentSessionToken);

  return (
    <div className="space-y-6">
      {currentSession && <SessionCard session={currentSession} isCurrentSession />}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Other active sessions</h3>
          {otherSessions.length > 0 && (
            <BetterAuthActionButton
              variant="destructive"
              size={'sm'}
              action={() =>
                authClient.revokeOtherSessions(undefined, {
                  onSuccess: () => {
                    router.refresh();
                  },
                })
              }
            >
              Revoke {otherSessions.length} sessions
            </BetterAuthActionButton>
          )}
        </div>
        {otherSessions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No other active sessions
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {otherSessions.map((session) => (
              <SessionCard key={session.token} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
