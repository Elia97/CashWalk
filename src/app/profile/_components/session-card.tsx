'use client';

import type { Session } from 'better-auth';
import { UAParser } from 'ua-parser-js';
import { Monitor, Smartphone, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button';
import { authClient } from '@/lib/auth/auth-client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function SessionCard({
  session,
  isCurrentSession = false,
}: {
  session: Session;
  isCurrentSession?: boolean;
}) {
  const router = useRouter();
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;

  const getBrowserInfo = () => {
    if (!userAgentInfo) return 'Unknown Device';
    if (!userAgentInfo.browser.name && !userAgentInfo.os.name) return 'Unknown Device';
    if (!userAgentInfo.browser.name) return userAgentInfo.os.name;
    if (!userAgentInfo.os.name) return userAgentInfo.browser.name;
    return `${userAgentInfo.browser.name} on ${userAgentInfo.os.name}`;
  };

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle>{getBrowserInfo()}</CardTitle>
        {isCurrentSession && <Badge>Current Session</Badge>}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {userAgentInfo?.device.type === 'mobile' ? <Smartphone /> : <Monitor />}
            <div>
              <p className="text-sm text-muted-foreground">
                Created: {formatDate(session.createdAt)}
              </p>
              <p className="text-sm text-muted-foreground">
                Expires: {formatDate(session.expiresAt)}
              </p>
            </div>
          </div>
          {!isCurrentSession && (
            <BetterAuthActionButton
              variant={'destructive'}
              size={'sm'}
              successMessage="Session revoked"
              action={() =>
                authClient.revokeSession(
                  {
                    token: session.token,
                  },
                  {
                    onSuccess: () => {
                      router.refresh();
                    },
                  },
                )
              }
            >
              <Trash2 />
            </BetterAuthActionButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
