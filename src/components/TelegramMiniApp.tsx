
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UssdResponse } from '@/lib/ussd-service';
import { Check, ArrowLeft } from 'lucide-react';

interface TelegramMiniAppProps {
  response: UssdResponse;
  onInput: (input: string) => void;
  isLoading: boolean;
}

const TelegramMiniApp: React.FC<TelegramMiniAppProps> = ({
  response,
  onInput,
  isLoading
}) => {
  const [userInput, setUserInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() && !isLoading) {
      onInput(userInput);
      setUserInput('');
    }
  };

  return (
    <div className="mini-app-container">
      <div className="bg-primary text-primary-foreground p-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className="p-0 text-primary-foreground" 
            onClick={() => onInput('back')}
            disabled={isLoading}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">USSD Service</h1>
        </div>
      </div>
      
      <div className="p-4 max-w-md mx-auto">
        <Card className="bg-card border-none shadow-md">
          <CardContent className="p-4">
            {isLoading ? (
              <div className="py-8 flex justify-center">
                <div className="typing-indicator pulse">Loading</div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">{
                    response.type === 'menu' ? 'Menu' :
                    response.type === 'input' ? 'Input Required' :
                    response.type === 'end' ? 'Transaction Complete' : 'Message'
                  }</h2>
                  <p className="whitespace-pre-line">{response.message}</p>
                </div>
                
                {response.type === 'input' && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type={response.inputType === 'pin' ? 'password' : 
                           response.inputType === 'number' ? 'number' : 'text'}
                      placeholder={
                        response.inputType === 'pin' ? 'Enter PIN' : 
                        response.inputType === 'number' ? 'Enter number' : 
                        response.inputType === 'phone' ? 'Enter phone number' : 
                        'Enter text'
                      }
                      value={userInput}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading || !userInput.trim()}
                    >
                      Submit
                    </Button>
                  </form>
                )}
                
                {response.type === 'menu' && response.options && (
                  <div className="space-y-2 pt-2">
                    {response.options.map((option) => (
                      <Button
                        key={option.id}
                        variant={option.id === 'back' ? "outline" : "default"}
                        className="w-full justify-start text-left"
                        onClick={() => onInput(option.id)}
                        disabled={isLoading}
                      >
                        {option.text}
                      </Button>
                    ))}
                  </div>
                )}
                
                {(response.type === 'message' || response.type === 'end') && (
                  <Button 
                    className="w-full" 
                    onClick={() => onInput('start')}
                    disabled={isLoading}
                  >
                    Return to Main Menu
                  </Button>
                )}
                
                {response.footer && (
                  <>
                    <Separator />
                    <p className="text-xs text-muted-foreground">{response.footer}</p>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TelegramMiniApp;
