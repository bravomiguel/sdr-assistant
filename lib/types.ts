import { Message } from "@langchain/langgraph-sdk";
import z from "zod";
import { formSchema } from "./schemas";

type EmailContent = {
  subject: string;
  body: string;
};

// export type InterruptValue = {
//   question: string;
//   to: string;
// } & EmailContent;

export type InterruptResponse = {
  type: "accept" | "edit" | "feedback";
  feedback?: string;
  email_content?: EmailContent;
};

export type FormValues = z.infer<typeof formSchema>;

// Define your thread state type
export type ThreadState = {
  prospect_info?: FormValues;
  messages?: Message[];
  email_content?: EmailContent;
  feedback?: string;
};
