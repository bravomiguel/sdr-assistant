"use client";

import { createContext, useContext, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { createThreadAction } from "@/lib/actions";
import { useQueryState } from "nuqs";

type ThreadProviderProps = {
  children: React.ReactNode;
};

type Threads = {
  createThread: () => void;
  isCreatingThread: boolean;
  activeThreadId: string | null;
  setActiveThreadId: (threadId: string | null) => void;
};

const ThreadContext = createContext<Threads | null>(null);

export function ThreadProvider({ children }: ThreadProviderProps) {
  const [activeThreadId, setActiveThreadId] = useQueryState("threadId");

  // console.log({ activeThreadId });

  const {
    data: newThread,
    mutate: createThread,
    isPending: isCreatingThread,
  } = useMutation({
    mutationFn: createThreadAction,
  });

  useEffect(() => {
    if (newThread) {
      setActiveThreadId(newThread.thread_id);
    }
  }, [newThread, setActiveThreadId]);

  return (
    <ThreadContext.Provider
      value={{
        createThread,
        isCreatingThread,
        activeThreadId,
        setActiveThreadId,
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
