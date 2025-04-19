
import React from 'react';

interface TelegramHeaderProps {
  sessionId: string;
}

const TelegramHeader: React.FC<TelegramHeaderProps> = ({ sessionId }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto mb-4 bg-card rounded-lg p-4 shadow-sm">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 text-primary"
        >
          <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h16a2 2 0 0 1 1.2.4" />
          <path d="M2 10h20" />
          <path d="M12 14v4" />
          <path d="M12 14a2 2 0 0 0 2-2V5.5A2.5 2.5 0 0 0 11.5 3 2.5 2.5 0 0 0 9 5.5V12c0 1.1.9 2 2 2Z" />
        </svg>
      </div>
      <h1 className="text-xl font-bold">USSD Gateway</h1>
      <p className="text-sm text-muted-foreground">Session ID: {sessionId.substring(0, 8)}</p>
    </div>
  );
};

export default TelegramHeader;
