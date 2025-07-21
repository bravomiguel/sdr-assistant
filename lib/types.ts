import { Message } from "@langchain/langgraph-sdk";
import z from "zod";
import { formSchema } from "./schemas";

export type InterruptValue = {
  question: string;
  to: string;
  subject: string;
  body: string;
};

export type InterruptResponse = {
  type: "accept" | "reject" | "feedback";
  feedback?: string;
};

export type FormValues = z.infer<typeof formSchema>;

// Define your thread state type
export type ThreadState = {
  prospect_info?: FormValues;
  messages?: Message[];
  email_content?: {
    subject: string;
    body: string;
  };
  feedback?: string;
};
