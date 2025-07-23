"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { useStream } from "@langchain/langgraph-sdk/react";
import {
  uiMessageReducer,
  type UIMessage,
  type RemoveUIMessage,
} from "@langchain/langgraph-sdk/react-ui";
import { toast } from "sonner";

import { useThreads } from "./thread-provider";
import { ThreadState } from "@/lib/types";
import { useFormContext } from "./form-provider";

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

type StreamContextTypeBase = ReturnType<typeof useTypedStream>;

export type StreamContextType = StreamContextTypeBase & {
  apiKey: string;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
};
const StreamContext = createContext<StreamContextType | null>(null);

export function StreamProvider({ children }: StreamProviderProps) {
  const { isInitGen, setIsInitGen } = useFormContext();

  // API key state shared across the app
  const [apiKey, setApiKey] = React.useState<string>("");

  // console.log({ apiKey });

  // Load saved key once on mount (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("openai_api_key");
    if (stored) setApiKey(stored);
  }, []);

  // Persist whenever apiKey changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (apiKey) {
      localStorage.setItem("openai_api_key", apiKey);
    } else {
      localStorage.removeItem("openai_api_key");
    }
  }, [apiKey]);
  const { activeThreadId, setActiveThreadId } = useThreads();
  const lastError = useRef<string | undefined>(undefined);

  const streamValue = useTypedStream({
    apiUrl: process.env.NEXT_PUBLIC_LANGGRAPH_API_URL,
    assistantId: process.env.NEXT_PUBLIC_LANGGRAPH_GRAPH_ID ?? "agent",
    threadId: activeThreadId,
    onCustomEvent: (event, options) => {
      options.mutate((prev) => {
        const ui = uiMessageReducer(prev.ui ?? [], event);
        return { ...prev, ui };
      });
    },
    onThreadId: setActiveThreadId,
  });

  // Error handling
  useEffect(() => {
    if (!streamValue.error) {
      lastError.current = undefined;
      return;
    }
    try {
      const message = (streamValue.error as any).message;
      if (!message || lastError.current === message) {
        // Message has already been logged. do not modify ref, return early.
        return;
      }

      // Message is defined, and it has not been logged yet. Save it, and send the error
      lastError.current = message;
      toast.error("An error occurred. Please try again.", {
        description: (
          <p>
            <strong>Error:</strong> <code>{message}</code>
          </p>
        ),
        richColors: true,
        closeButton: true,
      });

      if (isInitGen) {
        setIsInitGen(false);
      }
    } catch {
      // no-op
    }
  }, [streamValue.error, isInitGen, setIsInitGen]);

  // const contextValue = React.useMemo<StreamContextType>(
  //   () => ({
  //     ...streamValue,
  //     apiKey,
  //     setApiKey,
  //   }),
  //   [streamValue, apiKey]
  // );

  return (
    <StreamContext.Provider
      value={{
        ...streamValue,
        apiKey,
        setApiKey,
      }}
    >
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
