import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatbotContextType {
  isOpen: boolean;
  showAvatarSelection: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleChatbot: () => void;
  openAvatarSelection: () => void;
  closeAvatarSelection: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);

  const openChatbot = () => {
    setIsOpen(true);
  };

  const closeChatbot = () => {
    setIsOpen(false);
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const openAvatarSelection = () => {
    setShowAvatarSelection(true);
  };

  const closeAvatarSelection = () => {
    setShowAvatarSelection(false);
  };

  return (
    <ChatbotContext.Provider value={{ 
      isOpen, 
      showAvatarSelection,
      openChatbot, 
      closeChatbot, 
      toggleChatbot,
      openAvatarSelection,
      closeAvatarSelection
    }}>
      {children}
    </ChatbotContext.Provider>
  );
}; 