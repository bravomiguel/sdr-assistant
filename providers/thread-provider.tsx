"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { createThreadAction } from "@/lib/actions";
import { useQueryState } from "nuqs";

type ThreadProviderProps = {
  children: React.ReactNode;
};

type Threads = {
  createThread: () => Promise<void>;
  isCreatingThread: boolean;
  activeThreadId: string | null;
  setActiveThreadId: (threadId: string | null) => void;
  resetActiveThread: () => void;
};

const ThreadContext = createContext<Threads | null>(null);

export function ThreadProvider({ children }: ThreadProviderProps) {
  const [activeThreadId, setActiveThreadId] = useQueryState("threadId");
  const [isCreatingThread, setIsCreatingThread] = useState(false);

  const resetActiveThread = () => setActiveThreadId(null);

  // console.log({ activeThreadId });

  const createThread = async () => {
    setIsCreatingThread(true);

    const newThread = await createThreadAction();

    console.log({ newThreadId: newThread.thread_id });

    setActiveThreadId(newThread.thread_id);

    setIsCreatingThread(false);
  };

  // const {
  //   data: newThread,
  //   mutate: createThread,
  //   isPending: isCreatingThread,
  // } = useMutation({
  //   mutationFn: createThreadAction,
  // });

  // useEffect(() => {
  //   if (newThread) {
  //     setActiveThreadId(newThread.thread_id);
  //     console.log({ newThread });
  //   }
  // }, [newThread, setActiveThreadId]);

  return (
    <ThreadContext.Provider
      value={{
        createThread,
        isCreatingThread,
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
