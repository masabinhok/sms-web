import { create } from "zustand";

type MessageType = 'success' | 'error' | 'info' | 'warning';

interface Message {
    id: string;
    content: string;
    type: MessageType   ;
    createdAt: number;
}

interface MessageState {
    messages: Message[];
    addMessage: (content: string, type?: MessageType) => void;
    removeMessage: (id: string) => void;
    clearMessages: () => void;
}

export const useMessage = create<MessageState>((set) => ({
    messages: [],
    addMessage: (content, type='info') => set((state)=> ({
        messages: [
            ...state.messages, {
                id: crypto.randomUUID(), type, content, createdAt: Date.now()
            }
        ]
    })),
    removeMessage: (id) => set((state) => ({
        messages: state.messages.filter(msg => msg.id !== id)
    })),
    clearMessages: () => set({ messages: [] })
}));