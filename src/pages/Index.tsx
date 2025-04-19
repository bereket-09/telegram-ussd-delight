
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import UssdScreen from '@/components/UssdScreen';
import TelegramKeypad from '@/components/TelegramKeypad';
import TelegramMiniApp from '@/components/TelegramMiniApp';
import SessionHistory from '@/components/SessionHistory';
import ModeSwitcher from '@/components/ModeSwitcher';
import TelegramHeader from '@/components/TelegramHeader';
import { createSession, getCurrentMenu, processUssdRequest, UssdResponse } from '@/lib/ussd-service';
import '@fontsource/space-mono';

const Index = () => {
  const { toast } = useToast();
  const [session, setSession] = useState(createSession());
  const [currentResponse, setCurrentResponse] = useState<UssdResponse>({
    type: 'menu',
    message: 'Welcome to TeleUSSD!\n\nLoading menu...',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [mode, setMode] = useState<'classic' | 'mini-app'>('classic');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        // Initialize with the start menu
        const result = await processUssdRequest(session, 'start');
        setSession(result.session);
        setCurrentResponse(result.response);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to initialize USSD service",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 px-4 max-w-md mx-auto">
        <TelegramHeader sessionId={session.id} />
        <ModeSwitcher mode={mode} setMode={setMode} />

        {mode === 'classic' ? (
          <>
            <UssdScreen response={currentResponse} isLoading={isLoading} />
            <TelegramKeypad
              response={currentResponse}
              onInput={handleInput}
              isLoading={isLoading}
              userInput={userInput}
              setUserInput={setUserInput}
            />
            <SessionHistory history={session.history} />
          </>
        ) : (
          <TelegramMiniApp
            response={currentResponse}
            onInput={handleInput}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
