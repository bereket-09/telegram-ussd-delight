
// Simulated USSD service that would interact with your backend
export interface UssdResponse {
  type: 'menu' | 'input' | 'message' | 'end';
  message: string;
  options?: Array<{
    id: string;
    text: string;
  }>;
  inputType?: 'text' | 'number' | 'phone' | 'pin';
  footer?: string;
}

export interface UssdSession {
  id: string;
  history: UssdResponse[];
  currentPath: string[];
}

// Sample USSD menu data - this would come from your real API
const ussdMenus: Record<string, UssdResponse> = {
  "start": {
    type: "menu",
    message: "Welcome to TeleUSSD\n\nPlease select a service:",
    options: [
      { id: "banking", text: "Banking Services" },
      { id: "airtime", text: "Buy Airtime" },
      { id: "bills", text: "Pay Bills" },
      { id: "account", text: "My Account" }
    ]
  },
  "banking": {
    type: "menu",
    message: "Banking Services",
    options: [
      { id: "balance", text: "Check Balance" },
      { id: "transfer", text: "Transfer Money" },
      { id: "statement", text: "Mini Statement" },
      { id: "back", text: "Go Back" }
    ]
  },
  "banking.balance": {
    type: "input",
    message: "Enter your PIN to check balance:",
    inputType: "pin",
    footer: "Your PIN will not be shared with anyone"
  },
  "banking.balance.submitted": {
    type: "message",
    message: "Your current balance is:\n\n$2,450.75\n\nAvailable: $2,430.75\nHold: $20.00",
    footer: "Last updated on Apr 19, 2025"
  },
  "banking.transfer": {
    type: "menu",
    message: "Transfer Money To:",
    options: [
      { id: "mobile", text: "Mobile Money" },
      { id: "bank", text: "Bank Account" },
      { id: "saved", text: "Saved Beneficiary" },
      { id: "back", text: "Go Back" }
    ]
  },
  "banking.transfer.mobile": {
    type: "input",
    message: "Enter recipient's mobile number:",
    inputType: "phone"
  },
  "banking.transfer.mobile.submitted": {
    type: "input",
    message: "Enter amount to send (USD):",
    inputType: "number"
  },
  "banking.transfer.mobile.submitted.submitted": {
    type: "input",
    message: "Enter your PIN to authorize transfer of $50 to +254712345678:",
    inputType: "pin"
  },
  "banking.transfer.mobile.submitted.submitted.submitted": {
    type: "end",
    message: "Transfer of $50 to +254712345678 was successful!\n\nTransaction ID: TRX123456\nNew Balance: $2,400.75",
    footer: "Thank you for using our service"
  },
  "airtime": {
    type: "menu",
    message: "Buy Airtime",
    options: [
      { id: "self", text: "For Myself" },
      { id: "other", text: "For Someone Else" },
      { id: "bundle", text: "Buy Data Bundle" },
      { id: "back", text: "Go Back" }
    ]
  },
  "airtime.self": {
    type: "menu",
    message: "Select Amount:",
    options: [
      { id: "5", text: "$5" },
      { id: "10", text: "$10" },
      { id: "20", text: "$20" },
      { id: "custom", text: "Custom Amount" }
    ]
  },
  "airtime.self.5": {
    type: "input",
    message: "Confirm purchase of $5 airtime for your number +254712345678?\n\n1. Confirm\n2. Cancel",
    inputType: "number"
  },
  "airtime.self.5.submitted": {
    type: "end",
    message: "Airtime purchase successful!\n\n$5 airtime has been added to +254712345678.\n\nTransaction ID: AIR789012\nNew Balance: $2,445.75",
    footer: "Thank you for using our service"
  },
  "bills": {
    type: "menu",
    message: "Pay Bills",
    options: [
      { id: "electricity", text: "Electricity" },
      { id: "water", text: "Water" },
      { id: "internet", text: "Internet" },
      { id: "back", text: "Go Back" }
    ]
  },
  "account": {
    type: "menu",
    message: "My Account",
    options: [
      { id: "profile", text: "View Profile" },
      { id: "settings", text: "Settings" },
      { id: "support", text: "Customer Support" },
      { id: "back", text: "Go Back" }
    ]
  }
};

// Create a new session
export const createSession = (): UssdSession => {
  return {
    id: Math.random().toString(36).substring(2, 15),
    history: [],
    currentPath: []
  };
};

// Process a USSD request
export const processUssdRequest = async (
  session: UssdSession,
  input: string
): Promise<{ session: UssdSession; response: UssdResponse }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  let currentPath = [...session.currentPath];
  let response: UssdResponse;
  
  // If it's a new session or back action
  if (input === 'start') {
    currentPath = [];
    response = ussdMenus['start'];
  } else if (input === 'back' && currentPath.length > 0) {
    // Go back one level
    currentPath.pop();
    const path = currentPath.length === 0 ? 'start' : currentPath.join('.');
    response = ussdMenus[path];
  } else if (currentPath.length === 0) {
    // First level selection
    if (ussdMenus[input]) {
      currentPath.push(input);
      response = ussdMenus[input];
    } else {
      response = {
        type: 'message',
        message: 'Invalid selection. Please try again.',
      };
    }
  } else {
    // Handle nested selections
    const newPath = [...currentPath, input].join('.');
    
    // Check for form submissions
    const isFormSubmission = 
      currentPath.length > 0 && 
      ussdMenus[currentPath.join('.')].type === 'input';
    
    if (isFormSubmission) {
      const submissionPath = `${currentPath.join('.')}.submitted`;
      if (ussdMenus[submissionPath]) {
        currentPath.push('submitted');
        response = ussdMenus[submissionPath];
      } else {
        response = {
          type: 'message',
          message: 'Form submission error. Please try again.',
        };
      }
    } else if (ussdMenus[newPath]) {
      currentPath.push(input);
      response = ussdMenus[newPath];
    } else if (input === 'back' && currentPath.length > 0) {
      currentPath.pop();
      const path = currentPath.length === 0 ? 'start' : currentPath.join('.');
      response = ussdMenus[path];
    } else {
      response = {
        type: 'message',
        message: 'Invalid selection. Please try again.',
      };
    }
  }
  
  // Update session
  const updatedSession = {
    ...session,
    currentPath,
    history: [...session.history, response]
  };
  
  return { session: updatedSession, response };
};

// Get the current menu based on path
export const getCurrentMenu = (path: string[]): UssdResponse => {
  const menuPath = path.length === 0 ? 'start' : path.join('.');
  return ussdMenus[menuPath] || {
    type: 'message',
    message: 'Menu not found. Please restart.',
  };
};
