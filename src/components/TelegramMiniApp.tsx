
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UssdResponse } from '@/lib/ussd-service';
import { ArrowLeft, Phone } from 'lucide-react';

interface TelegramMiniAppProps {
  response: UssdResponse;
  onInput: (input: string) => void;
  isLoading: boolean;
  sessionId: string;
}

const TelegramMiniApp: React.FC<TelegramMiniAppProps> = ({
  response,
  onInput,
  isLoading,
  sessionId
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

  const handleStartSession = () => {
    onInput('start');
  };

  const isStartScreen = !isLoading && response.message === 'Welcome to TeleUSSD!\n\nLoading menu...';

  return (
    <div className="mini-app-container">
      <div className="bg-[#1A1F2C] text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className="p-0 text-white" 
            onClick={() => onInput('back')}
            disabled={isLoading || isStartScreen}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">USSD Service</h1>
        </div>
      </div>
      
      <div className="p-4 max-w-md mx-auto">
        {isStartScreen ? (
          <div className="text-center py-8">
            <Button 
              size="lg"
              className="bg-[#49b349] hover:bg-[#378937] text-white font-bold py-6 px-8 rounded-lg shadow-lg transition-all duration-300 mb-6"
              onClick={handleStartSession}
              disabled={isLoading}
            >
              <Phone className="w-6 h-6 mr-2" />
              Dial USSD *777#
            </Button>
          </div>
        ) : (
          <Card className="bg-white border-none shadow-md">
            <CardContent className="p-4">
              {isLoading ? (
                <div className="py-8 flex justify-center">
                  <div className="typing-indicator pulse">Loading</div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-[#1A1F2C]">{
                      response.type === 'menu' ? 'Menu' :
                      response.type === 'input' ? 'Input Required' :
                      response.type === 'end' ? 'Transaction Complete' : 'Message'
                    }</h2>
                    <p className="whitespace-pre-line text-[#1A1F2C]">{response.message}</p>
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
                        className="w-full border-[#49b349] focus:ring-[#378937]"
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-[#49b349] hover:bg-[#378937]" 
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
                          className={`w-full justify-start text-left ${
                            option.id === 'back' 
                              ? 'border-[#49b349] text-[#49b349] hover:bg-[#49b349] hover:text-white' 
                              : 'bg-[#49b349] hover:bg-[#378937] text-white'
                          }`}
                          onClick={() => onInput(option.id)}
                          disabled={isLoading}
                        >
                          {option.text.includes('\n') ? (
                            <div className="flex gap-2">
                              <span className="text-sm">{option.text.split('\n')[0]}.</span>
                              <span>{option.text.split('\n')[1]}</span>
                            </div>
                          ) : (
                            option.text
                          )}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  {(response.type === 'message' || response.type === 'end') && (
                    <Button 
                      className="w-full bg-[#49b349] hover:bg-[#378937]" 
                      onClick={() => onInput('start')}
                      disabled={isLoading}
                    >
                      Return to Main Menu
                    </Button>
                  )}
                  
                  {response.footer && (
                    <>
                      <Separator />
                      <p className="text-xs text-[#8E9196]">{response.footer}</p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TelegramMiniApp;
