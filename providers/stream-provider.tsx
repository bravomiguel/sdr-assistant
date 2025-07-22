"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useStream } from "@langchain/langgraph-sdk/react";
import { type Message } from "@langchain/langgraph-sdk";
import {
  uiMessageReducer,
  type UIMessage,
  type RemoveUIMessage,
} from "@langchain/langgraph-sdk/react-ui";
import { useThreads } from "./thread-provider";
import { ThreadState } from "@/lib/types";
import { sleep } from "@/lib/utils";

type StreamProviderProps = {
  children: React.ReactNode;
};

export type StateType = ThreadState & {
  ui?: UIMessage[];
};

const useTypedStream = useStream<
  StateType,
  {
    UpdateType: ThreadState & {
      ui?: UIMessage[];
    };
    CustomEventType: UIMessage | RemoveUIMessage;
    ConfigurableType: {
      user_id: string;
      model?: string;
    };
  }
>;

type StreamContextType = ReturnType<typeof useTypedStream>;
const StreamContext = createContext<StreamContextType | null>(null);

export function StreamProvider({ children }: StreamProviderProps) {
  const { activeThreadId, setActiveThreadId } = useThreads();

  const streamValue = useTypedStream({
    apiUrl: process.env.NEXT_PUBLIC_LANGGRAPH_API_URL,
    assistantId: process.env.NEXT_PUBLIC_LANGGRAPH_GRAPH_ID ?? "agent",
    threadId: activeThreadId ?? null,
    onCustomEvent: (event, options) => {
      options.mutate((prev) => {
        const ui = uiMessageReducer(prev.ui ?? [], event);
        return { ...prev, ui };
      });
    },
    onThreadId: async (id) => {
      //   await updateThreadAction(id);
      // await sleep(500);
      console.log({ id });
      setActiveThreadId(id);
    },
  });

  return (
    <StreamContext.Provider value={streamValue}>
      {children}
    </StreamContext.Provider>
  );
}

// Create a custom hook to use the context
export const useStreamContext = (): StreamContextType => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error("useStreamContext must be used within a StreamProvider");
  }
  return context;
};

export default StreamContext;
