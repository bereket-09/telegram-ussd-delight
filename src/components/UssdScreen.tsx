
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UssdResponse } from '@/lib/ussd-service';

interface UssdScreenProps {
  response: UssdResponse;
  isLoading?: boolean;
}

const UssdScreen: React.FC<UssdScreenProps> = ({ response, isLoading = false }) => {
  return (
    <Card className="ussd-screen w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="text-center text-lg font-mono">
          USSD Menu
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <ScrollArea className="h-[200px] rounded">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground typing-indicator pulse">Processing</p>
            </div>
          ) : (
            <div className="space-y-4 p-1">
              <p className="whitespace-pre-line text-sm font-mono">{response.message}</p>
              
              {response.type === 'menu' && response.options && (
                <div className="space-y-2 mt-4">
                  {response.options.map((option, index) => (
                    <div key={option.id} className="flex gap-2">
                      <span className="text-primary font-bold">{index + 1}.</span>
                      <span>{option.text}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {response.type === 'input' && (
                <div className="mt-4 p-2 bg-muted rounded-md">
                  <p className="text-xs text-muted-foreground">
                    {response.inputType === 'pin' ? 'Enter PIN' : 
                     response.inputType === 'number' ? 'Enter number' : 
                     response.inputType === 'phone' ? 'Enter phone number' : 
                     'Enter text'}
                  </p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      {response.footer && (
        <>
          <Separator />
          <CardFooter className="py-2 px-4 bg-muted/30">
            <p className="text-xs text-muted-foreground w-full text-center">{response.footer}</p>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default UssdScreen;
