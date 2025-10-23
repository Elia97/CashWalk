import type { Session } from "../page";
import { SessionManagement } from "./session-management";
import { Card, CardContent } from "@/components/ui";

export async function SessionsTab({
  sessions,
  currentSessionToken,
}: {
  sessions: Session[];
  currentSessionToken: string;
}) {
  return (
    <Card>
      <CardContent>
        <SessionManagement
          sessions={sessions}
          currentSessionToken={currentSessionToken}
        />
      </CardContent>
    </Card>
  );
}
