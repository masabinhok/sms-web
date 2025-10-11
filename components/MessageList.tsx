'use client'

import { useMessage } from "@/store/messageStore";
import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

// Individual message component that handles its own timer
const MessageItem = ({ 
  msg, 
  onRemove 
}: { 
  msg: { id: string; content: string; type: 'success' | 'error' | 'info' | 'warning' }; 
  onRemove: (id: string) => void 
}) => {
  // Each message has its own independent timer
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(msg.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [msg.id, onRemove]);

  const getMessageStyles = (type: 'success' | 'error' | 'info' | 'warning') => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 text-green-800',
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          progress: 'bg-green-600'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
          progress: 'bg-red-600'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
          progress: 'bg-yellow-600'
        };
      case 'info':
      default:
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: <Info className="h-5 w-5 text-blue-600" />,
          progress: 'bg-blue-600'
        };
    }
  };

  const styles = getMessageStyles(msg.type);

  return (
    <div
      className={`${styles.container} border rounded-lg shadow-lg p-4 flex items-start gap-3 
        animate-in slide-in-from-right-5 fade-in duration-300 
        hover:shadow-xl transition-shadow relative overflow-hidden`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {styles.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-relaxed">
          {msg.content}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={() => onRemove(msg.id)}
        className="flex-shrink-0 rounded-full p-1 hover:bg-black/5 transition-colors"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
        <div
          className={`${styles.progress} h-full`}
          style={{
            animation: 'progress 5s linear forwards'
          }}
        />
      </div>
    </div>
  );
};

const MessageList = () => {
  const { messages, removeMessage } = useMessage();

  return (
    <>
      <div className="fixed top-4 right-4 space-y-3 z-[9999] max-w-md">
        {messages.map((msg) => (
          <MessageItem key={msg.id} msg={msg} onRemove={removeMessage} />
        ))}
      </div>

      <style jsx global>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </>
  );
};

export default MessageList;