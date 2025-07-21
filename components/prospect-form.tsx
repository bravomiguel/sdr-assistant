import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { ChevronLeft, Loader2 } from "lucide-react";
import { useStreamContext } from "@/providers/stream-provider";
import { formSchema } from "@/lib/schemas";
import { FormValues, InterruptResponse, InterruptValue } from "@/lib/types";

export function ProspectForm() {
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [backToForm, setBackToForm] = useState(false);
  const emailBodyRef = useRef<HTMLTextAreaElement>(null);

  const { submit, interrupt, ...stream } = useStreamContext();
  const lastError = useRef<string | undefined>(undefined);
  const interruptValue = interrupt?.value as InterruptValue | undefined;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      website: "",
      door_count: "",
      property_management_software: "",
      notes: "",
    },
  });

  console.log({ form });

  function onSubmit(values: FormValues) {
    console.log(values);

    submit(
      {
        prospect_info: values,
      },
      {
        // config: {
        //   configurable: {
        //     user_id: session.user.id,
        //   },
        // },
        streamMode: ["values"],
        // optimisticValues: (prev) => ({
        //   ...prev,
        //   messages: [...(prev.messages ?? []), newHumanMessage],
        // }),
      }
    );
  }

  function handleInterruptResponse({ type }: InterruptResponse) {
    if (type === "accept") {
      setIsSending(true);
      submit(
        {},
        {
          command: {
            resume: {
              type: "accept",
            },
          },
        }
      );
      setIsSending(false);
    }

    if (type === "reject") {
      submit(
        {},
        {
          command: {
            resume: {
              type: "reject",
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
              type: "feedback",
              feedback:
                feedbackText.length > 0
                  ? feedbackText
                  : "No user feedback available.",
            },
          },
        }
      );
    }
  }

  // Error handling
  useEffect(() => {
    if (!stream.error) {
      lastError.current = undefined;
      return;
    }
    try {
      const message = (stream.error as any).message;
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
    } catch {
      // no-op
    }
  }, [stream.error]);

  return (
    <div className="flex flex-col h-full">
      {!stream || backToForm ? (
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
                          <Input
                            placeholder="john.doe@example.com"
                            {...field}
                          />
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
                          <Input
                            placeholder="Yardi, Buildium, etc."
                            {...field}
                          />
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
                  <Button type="submit" className="w-full">
                    Generate Email
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full flex flex-col h-full">
          <CardHeader className="flex-shrink-0 flex items-center justify-between relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2"
              onClick={() => {
                setBackToForm(true);
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
                    value={stream.values.prospect_info?.email || ""}
                    readOnly
                  />
                </div>

                <div className="space-y-2 flex-shrink-0">
                  <FormLabel>Subject</FormLabel>
                  <Input
                    value={stream.values.email_content?.subject || ""}
                    readOnly
                    className={stream.isLoading ? "animate-pulse" : ""}
                  />
                </div>

                <div className="space-y-2 flex-grow flex flex-col min-h-0">
                  <FormLabel className="flex-shrink-0">Email Body</FormLabel>
                  <div className="flex-grow relative min-h-0">
                    <Textarea
                      ref={emailBodyRef}
                      value={stream.values.email_content?.body || ""}
                      readOnly
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
                      <ChevronLeft className="h-4 w-4" />
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
                    className="px-6"
                    onClick={() => {
                      setShowFeedbackInput(true);
                    }}
                  >
                    Suggest Edits
                  </Button>
                )}
                <Button
                  disabled={stream.isLoading}
                  className="px-6"
                  onClick={() => handleInterruptResponse({ type: "accept" })}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : stream.isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Send Email"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
