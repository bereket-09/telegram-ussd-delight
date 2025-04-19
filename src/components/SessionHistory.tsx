
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UssdResponse } from '@/lib/ussd-service';

interface SessionHistoryProps {
  history: UssdResponse[];
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ history }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Session History</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {history.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <Separator className="my-2" />}
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">
                    Step {index + 1} • {item.type.toUpperCase()}
                  </div>
                  <p className="text-sm truncate">
                    {item.message.split('\n')[0]}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SessionHistory;
