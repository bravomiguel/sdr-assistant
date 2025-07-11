import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StickyContainerProps {
  children: React.ReactNode;
}

export function StickyContainer({ children }: StickyContainerProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Function to handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setIsMinimized(true);
      }
    };

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Clean up
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-2 rounded-full shadow-lg z-50"
      >
        SDR
      </button>
    );
  }

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out shadow-lg rounded-lg overflow-hidden",
        isMinimized
          ? "fixed bottom-4 right-4 w-72 h-16 z-50 bg-background"
          : "w-full h-full"
      )}
    >
      {isMinimized ? (
        <div 
          className="flex items-center justify-between p-4 cursor-pointer w-full h-full"
          onClick={toggleMinimize}
        >
          <div className="flex items-center">
            <span className="font-semibold">SDR Assistant</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleVisibility();
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Hide
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-2 bg-muted/20">
            <button
              onClick={toggleMinimize}
              className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1"
            >
              Minimize
            </button>
          </div>
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      )}
    </div>
  );
}
