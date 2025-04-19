
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UssdResponse } from '@/lib/ussd-service';
import { Check } from 'lucide-react';

interface TelegramKeypadProps {
  response: UssdResponse;
  onInput: (input: string) => void;
  isLoading: boolean;
  userInput: string;
  setUserInput: (input: string) => void;
}

const TelegramKeypad: React.FC<TelegramKeypadProps> = ({
  response,
  onInput,
  isLoading,
  userInput,
  setUserInput
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() && !isLoading) {
      onInput(userInput);
      setUserInput('');
    }
  };

  const handleButtonClick = (optionId: string) => {
    if (!isLoading) {
      onInput(optionId);
    }
  };

  const handleBack = () => {
    if (!isLoading) {
      onInput('back');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      {response.type === 'menu' && response.options && (
        <div className="button-grid">
          {response.options.map((option) => (
            <Button
              key={option.id}
              variant={option.id === 'back' ? "outline" : "default"}
              className={`${option.id === 'back' ? "border-primary text-primary" : ""}`}
              onClick={() => handleButtonClick(option.id)}
              disabled={isLoading}
            >
              {option.text}
            </Button>
          ))}
        </div>
      )}

      {(response.type === 'input' || response.type === 'message' || response.type === 'end') && (
        <div className="space-y-2">
          {response.type === 'input' && (
            <form onSubmit={handleFormSubmit} className="flex gap-2">
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
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !userInput.trim()}>
                <Check className="w-4 h-4" />
              </Button>
            </form>
          )}
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={isLoading}
              className="border-primary text-primary"
            >
              Back
            </Button>
            
            {response.type === 'message' || response.type === 'end' ? (
              <Button onClick={() => onInput('start')} disabled={isLoading}>
                Main Menu
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default TelegramKeypad;
