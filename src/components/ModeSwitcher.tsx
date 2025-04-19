
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

interface ModeSwitcherProps {
  mode: 'classic' | 'mini-app';
  setMode: (mode: 'classic' | 'mini-app') => void;
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ mode, setMode }) => {
  return (
    <div className="w-full max-w-md mx-auto mb-4">
      <Tabs
        defaultValue={mode}
        className="w-full"
        onValueChange={(value) => setMode(value as 'classic' | 'mini-app')}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="classic"
            className={cn(
              "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            )}
          >
            Classic Mode
          </TabsTrigger>
          <TabsTrigger
            value="mini-app"
            className={cn(
              "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            )}
          >
            Mini App
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ModeSwitcher;
