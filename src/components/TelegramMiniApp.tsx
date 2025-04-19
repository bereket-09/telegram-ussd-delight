
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
    <div className="mini-app-container bg-gradient-to-br from-[#f0f2f5] to-white dark:from-[#1a1f2c] dark:to-[#2d3748]">
      <div className="bg-gradient-to-r from-[#49b349] to-[#378937] text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className="p-0 text-white hover:bg-white/20" 
            onClick={() => onInput('back')}
            disabled={isLoading || isStartScreen}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Safaricom USSD Service</h1>
        </div>
      </div>
      
      <div className="p-4 max-w-md mx-auto">
        {isStartScreen ? (
          <div className="text-center py-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#49b349] mb-2">Welcome to Safaricom USSD</h2>
              <p className="text-gray-600 dark:text-gray-400">Access your services with one click</p>
            </div>
            <Button 
              size="lg"
              className="bg-[#49b349] hover:bg-[#378937] text-white font-bold py-8 px-10 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              onClick={handleStartSession}
              disabled={isLoading}
            >
              <Phone className="w-8 h-8 mr-3" />
              Dial USSD *777#
            </Button>
          </div>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-none shadow-xl">
            <CardContent className="p-6">
              {isLoading ? (
                <div className="py-8 flex justify-center">
                  <div className="typing-indicator pulse">Processing your request</div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-[#1A1F2C] dark:text-white mb-4">
                      {response.type === 'menu' ? 'Menu Options' :
                       response.type === 'input' ? 'Input Required' :
                       response.type === 'end' ? 'Transaction Complete' : 'Message'}
                    </h2>
                    <div className="space-y-4">
                      {response.message.split('\n').map((line, index) => (
                        <p key={index} className={`
                          ${index === 0 ? 'text-lg font-medium text-[#49b349]' : 'text-gray-700 dark:text-gray-300'}
                          ${line.trim().startsWith('Transaction ID:') ? 'font-mono text-sm' : ''}
                        `}>
                          {line}
                        </p>
                      ))}
                    </div>
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
                        className="w-full border-[#49b349] focus:ring-[#378937] text-lg"
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-[#49b349] hover:bg-[#378937] transition-colors duration-300" 
                        disabled={isLoading || !userInput.trim()}
                      >
                        Submit
                      </Button>
                    </form>
                  )}
                  
                  {response.type === 'menu' && response.options && (
                    <div className="space-y-3">
                      {response.options.map((option) => (
                        <Button
                          key={option.id}
                          variant={option.id === 'back' ? "outline" : "default"}
                          className={`w-full justify-start text-left p-4 ${
                            option.id === 'back' 
                              ? 'border-[#49b349] text-[#49b349] hover:bg-[#49b349] hover:text-white' 
                              : 'bg-[#49b349] hover:bg-[#378937] text-white'
                          } transition-all duration-300 transform hover:translate-x-1`}
                          onClick={() => onInput(option.id)}
                          disabled={isLoading}
                        >
                          <div className="flex gap-2 items-center">
                            <span className="text-sm font-bold w-6">{option.id === 'back' ? '↩' : `${response.options?.indexOf(option) + 1}.`}</span>
                            <span>{option.text}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  {(response.type === 'message' || response.type === 'end') && (
                    <Button 
                      className="w-full bg-[#49b349] hover:bg-[#378937] transition-colors duration-300" 
                      onClick={() => onInput('start')}
                      disabled={isLoading}
                    >
                      Return to Main Menu
                    </Button>
                  )}
                  
                  {(response.footer || !isStartScreen) && (
                    <>
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        {response.footer && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{response.footer}</p>
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-right space-y-1">
                          <p>Name: John Doe</p>
                          <p>MSISDN: 251700405140</p>
                          <p>Last updated: {new Date().toLocaleString()}</p>
                        </div>
                      </div>
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
