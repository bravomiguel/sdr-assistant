"use client";

import { createContext, useContext } from "react";
import { useQueryState } from "nuqs";

type ThreadProviderProps = {
  children: React.ReactNode;
};

type Threads = {
  activeThreadId: string | null;
  setActiveThreadId: (threadId: string | null) => void;
  resetActiveThread: () => void;
};

const ThreadContext = createContext<Threads | null>(null);

export function ThreadProvider({ children }: ThreadProviderProps) {
  const [activeThreadId, setActiveThreadId] = useQueryState("threadId");

  const resetActiveThread = () => {
    setActiveThreadId(null);
  };

  return (
    <ThreadContext.Provider
      value={{
        activeThreadId,
        setActiveThreadId,
        resetActiveThread,
      }}
    >
      {children}
    </ThreadContext.Provider>
  );
}

export function useThreads() {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error("useThreads must be used within a ThreadProvider");
  }
  return context;
}
