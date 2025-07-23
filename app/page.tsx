"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2, X } from "lucide-react";
import { useStreamContext } from "@/providers/stream-provider";
import { FormValues, InterruptResponse } from "@/lib/types";
import { useThreads } from "@/providers/thread-provider";
import { parseStreamingContent, sleep } from "@/lib/utils";
import { useFormContext } from "@/providers/form-provider";
import { defaultValues } from "@/lib/constants";

export default function Home() {
  const { activeThreadId } = useThreads();

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="max-w-md w-full bg-background flex flex-col h-screen">
        <div className="flex flex-col h-full">
          <Header />
          <main className="flex-1 p-4 w-full overflow-hidden">
            <div className="flex flex-col h-full">
              {!activeThreadId ? <InputFormCard /> : <EmailCard />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function InputFormCard() {
  const { form, isInitGen, setIsInitGen } = useFormContext();
  const { submit, apiKey } = useStreamContext();

  const onSubmit = async (values: FormValues) => {
    setIsInitGen(true);

    await sleep(600);

    const config = {
      configurable: {
        user_id: "walt-boxwell",
        api_key: apiKey,
      },
    };

    submit(
      {
        prospect_info: values,
      },
      {
        config,
        streamMode: ["values"],
        // streamMode: ["messages-tuple"],
      }
    );
  };

  return (
    <Card className="w-full flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Prospect Information</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="h-full flex flex-col"
          >
            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="door_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Door Count</FormLabel>
                    <FormControl>
                      <Input placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="property_management_software"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Management Software</FormLabel>
                    <FormControl>
                      <Input placeholder="Yardi, Buildium, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anything Else (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes about the prospect..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-shrink-0 sticky bottom-0 p-6 pt-4 shadow-md">
              <Button type="submit" className="w-full" disabled={isInitGen}>
                {isInitGen ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Email"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function EmailCard() {
  const { form, handleNewForm, toEmail, setIsInitGen } = useFormContext();
  const { setActiveThreadId } = useThreads();
  const { submit, apiKey, ...stream } = useStreamContext();

  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Get current email content - prioritize structured data when available
  const getCurrentEmailContent = () => {
    // If we have structured email_content, use it (generation complete)
    if (
      stream.values.email_content?.subject ||
      stream.values.email_content?.body
    ) {
      return {
        subject: stream.values.email_content.subject || "",
        body: stream.values.email_content.body || "",
        isStreaming: false,
      };
    }

    // Otherwise, parse from streaming messages (generation in progress)
    const lastMessage = stream.messages?.[stream.messages.length - 1];
    if (lastMessage?.content && typeof lastMessage.content === "string") {
      const parsed = parseStreamingContent(lastMessage.content);
      return {
        subject: parsed.subject,
        body: parsed.body,
        isStreaming: stream.isLoading,
      };
    }

    return {
      subject: "",
      body: "",
      isStreaming: stream.isLoading,
    };
  };

  const currentContent = useMemo(() => {  
    return getCurrentEmailContent();  
  }, [  
    stream.values.email_content?.subject,  
    stream.values.email_content?.body,   
    stream.messages,  
    stream.isLoading  
  ]);

  // Local editable state for the email subject and body
  const [subject, setSubject] = useState(currentContent.subject);
  const [emailBody, setEmailBody] = useState(currentContent.body);

  // Track whether the user has modified the draft from its original values
  const [isSubjectChanged, setIsSubjectChanged] = useState(false);
  const [isBodyChanged, setIsBodyChanged] = useState(false);

  // console.log({ subject, isSubjectChanged });
  // console.log({ emailBody, isBodyChanged });

  // Update local state when content changes (either from streaming or structured)
  useEffect(() => {
    setSubject(currentContent.subject);
    setEmailBody(currentContent.body);
    setIsSubjectChanged(false);
    setIsBodyChanged(false);
  }, [currentContent.subject, currentContent.body]);

  const handleInterruptResponse = ({ type }: InterruptResponse) => {
    const config = {
      configurable: {
        user_id: "walt-boxwell",
        api_key: apiKey,
      },
    };

    if (type === "accept") {
      setIsSending(true);
      submit(
        {},
        {
          command: {
            resume: { type },
          },
        }
      );
    }

    if (type === "edit") {
      setIsSending(true);
      submit(
        {},
        {
          command: {
            resume: {
              type,
              email_content: {
                subject: subject,
                body: emailBody,
              },
            },
          },
        }
      );
    }

    if (type === "feedback") {
      submit(
        {},
        {
          command: {
            resume: {
              type,
              feedback:
                feedbackText.length > 0
                  ? feedbackText
                  : "No user feedback available.",
            },
          },
        }
      );
    }
  };

  // wait for submit to finish before cleaning up accept action
  useEffect(() => {
    if (isSending && !stream.isLoading) {
      setIsSending(false);
      handleNewForm();
      toast.success("Email sent successfully");
    }
  }, [stream.isLoading, isSending]);

  return (
    <Card className="w-full flex flex-col h-full">
      <CardHeader className="flex-shrink-0 flex items-center justify-between relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2"
          onClick={() => {
            form.reset(stream.values?.prospect_info || defaultValues);
            setIsInitGen(false);
            setActiveThreadId(null);
          }}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <CardTitle className="w-full text-center">Email Draft</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 px-6 py-4 flex flex-col space-y-4">
            <div className="space-y-2 flex-shrink-0">
              <FormLabel>To</FormLabel>
              <Input
                value={toEmail || stream.values.prospect_info?.email || ""}
                readOnly
              />
            </div>

            <div className="space-y-2 flex-shrink-0">
              <FormLabel>Subject</FormLabel>
              <Input
                value={subject}
                onChange={(e) => {
                  const val = e.target.value;
                  setSubject(val);
                  setIsSubjectChanged(
                    val !== (stream.values.email_content?.subject || "")
                  );
                }}
                className={stream.isLoading ? "animate-pulse" : ""}
              />
            </div>

            <div className="space-y-2 flex-grow flex flex-col min-h-0">
              <FormLabel className="flex-shrink-0">Email Body</FormLabel>
              <div className="flex-grow relative min-h-0">
                <Textarea
                  value={emailBody}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmailBody(val);
                    setIsBodyChanged(
                      val !== (stream.values.email_content?.body || "")
                    );
                  }}
                  className={`resize-none absolute inset-0 h-full w-full overflow-auto ${
                    stream.isLoading ? "animate-pulse" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 sticky bottom-0 p-6 pt-4 flex justify-between relative">
            {showFeedbackInput && (
              <div className="absolute bottom-full left-0 right-0 bg-white px-6 pb-2 pt-3">
                <Textarea
                  placeholder="Enter optional feedback to regenerate email..."
                  className="resize-none overflow-auto mt-1"
                  style={{
                    minHeight: "2.5rem",
                    maxHeight: "10rem",
                    height: "auto",
                  }}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  autoFocus
                  rows={1}
                />
              </div>
            )}
            {showFeedbackInput ? (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={stream.isLoading}
                  onClick={() => {
                    setShowFeedbackInput(false);
                    setFeedbackText("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  disabled={stream.isLoading}
                  className="px-6"
                  onClick={() => {
                    // Reset email content and trigger regeneration
                    handleInterruptResponse({
                      type: "feedback",
                      feedback: feedbackText,
                    });
                    setShowFeedbackInput(false);
                    setFeedbackText("");
                  }}
                >
                  Regenerate
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                disabled={stream.isLoading}
                onClick={() => {
                  setShowFeedbackInput(true);
                }}
              >
                Suggest Edits
              </Button>
            )}

            <div className="flex space-x-2">
              <Button
                variant="outline"
                disabled={stream.isLoading}
                onClick={() => {
                  handleNewForm();
                }}
              >
                Discard
              </Button>
              <Button
                disabled={stream.isLoading || isSending}
                onClick={() => {
                  if (isSubjectChanged || isBodyChanged) {
                    handleInterruptResponse({ type: "edit" });
                  } else {
                    handleInterruptResponse({ type: "accept" });
                  }
                }}
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : stream.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Send"
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
