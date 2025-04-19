
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import TelegramMiniApp from '@/components/TelegramMiniApp';
import { createSession, getCurrentMenu, processUssdRequest, UssdResponse } from '@/lib/ussd-service';

const Index = () => {
  const { toast } = useToast();
  const [session, setSession] = useState(createSession());
  const [currentResponse, setCurrentResponse] = useState<UssdResponse>({
    type: 'menu',
    message: 'Welcome to TeleUSSD!\n\nLoading menu...',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = async (input: string) => {
    try {
      setIsLoading(true);
      const result = await processUssdRequest(session, input);
      setSession(result.session);
      setCurrentResponse(result.response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't initialize automatically anymore - wait for user to click "Dial USSD"

  return (
    <div className="min-h-screen bg-background">
      <TelegramMiniApp
        response={currentResponse}
        onInput={handleInput}
        isLoading={isLoading}
        sessionId={session.id}
      />
    </div>
  );
};

export default Index;
