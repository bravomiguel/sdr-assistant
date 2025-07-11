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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().min(1, {
    message: "Company name is required.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal("")),
  doorCount: z.string().min(1, {
    message: "Door count is required.",
  }),
  propertyManagementSoftware: z.string().min(1, {
    message: "Property management software is required.",
  }),
  notes: z.string().optional(),
});

export function ProspectForm() {
  const [showEmailCard, setShowEmailCard] = useState(false);
  const [formData, setFormData] = useState<z.infer<typeof formSchema> | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubjectComplete, setIsSubjectComplete] = useState(false);
  const [isBodyComplete, setIsBodyComplete] = useState(false);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const emailBodyRef = useRef<HTMLTextAreaElement>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      website: "",
      doorCount: "",
      propertyManagementSoftware: "",
      notes: "",
    },
  });

  // Simulate streaming of subject and body content
  useEffect(() => {
    if (showEmailCard && isGenerating) {
      // Dummy subject content
      const dummySubject = `Partnership opportunity with ${formData?.company}`;
      let subjectIndex = 0;
      
      // Dummy email body content
      const dummyBody = `Dear ${formData?.name},\n\nI hope this email finds you well. I recently came across ${formData?.company} and was impressed by your property management solutions.\n\nGiven that you manage approximately ${formData?.doorCount} doors and use ${formData?.propertyManagementSoftware} for your property management needs, I believe our services could bring significant value to your operations.\n\nWould you be available for a brief call next week to discuss how we might be able to help streamline your property management processes?\n\nBest regards,\nYour SDR`;
      let bodyIndex = 0;
      
      // Stream subject content
      const subjectInterval = setInterval(() => {
        if (subjectIndex < dummySubject.length) {
          setEmailSubject(prev => prev + dummySubject[subjectIndex]);
          subjectIndex++;
        } else {
          clearInterval(subjectInterval);
          setIsSubjectComplete(true);
          
          // Start streaming body content after subject is complete
          const bodyInterval = setInterval(() => {
            if (bodyIndex < dummyBody.length) {
              setEmailBody(prev => prev + dummyBody[bodyIndex]);
              bodyIndex++;
              
              // Scroll to the bottom of the textarea when new content is added
              setTimeout(() => {
                if (emailBodyRef.current) {
                  emailBodyRef.current.scrollTop = emailBodyRef.current.scrollHeight;
                }
              }, 0);
            } else {
              clearInterval(bodyInterval);
              setIsBodyComplete(true);
              setIsGenerating(false);
            }
          }, 30); // Adjust speed as needed
        }
      }, 50); // Adjust speed as needed
      
      return () => {
        clearInterval(subjectInterval);
      };
    }
  }, [showEmailCard, isGenerating, formData]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Save form data
    setFormData(values);
    // Show email card
    setShowEmailCard(true);
    // Start generating email content
    setIsGenerating(true);
  }

  function handleSendEmail() {
    setIsSending(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      setIsSending(false);
      toast.success("Email sent successfully!");
      
      // Reset the form and return to prospect form
      setShowEmailCard(false);
      setEmailSubject("");
      setEmailBody("");
      setIsSubjectComplete(false);
      setIsBodyComplete(false);
      form.reset();
    }, 1500); // 1.5 seconds delay to simulate sending
  }

  return (
    <div className="flex flex-col h-full">
      {!showEmailCard ? (
        <Card className="w-full flex flex-col h-full">
          <CardHeader className="flex-shrink-0">
            <CardTitle>Prospect Information</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
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
                    name="doorCount"
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
                    name="propertyManagementSoftware"
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
                  <Button type="submit" className="w-full">Generate Email</Button>
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
                setShowEmailCard(false);
                setEmailSubject("");
                setEmailBody("");
                setIsSubjectComplete(false);
                setIsBodyComplete(false);
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
                  <Input value={formData?.email || ""} readOnly />
                </div>
                
                <div className="space-y-2 flex-shrink-0">
                  <FormLabel>Subject</FormLabel>
                  <Input 
                    value={emailSubject} 
                    readOnly 
                    className={!isSubjectComplete ? "animate-pulse" : ""}
                  />
                </div>
                
                <div className="space-y-2 flex-grow flex flex-col min-h-0">
                  <FormLabel className="flex-shrink-0">Email Body</FormLabel>
                  <div className="flex-grow relative min-h-0">
                    <Textarea 
                      ref={emailBodyRef}
                      value={emailBody} 
                      readOnly 
                      className={`resize-none absolute inset-0 h-full w-full overflow-auto ${!isBodyComplete ? "animate-pulse" : ""}`}
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
                        minHeight: '2.5rem',
                        maxHeight: '10rem',
                        height: 'auto'
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
                      disabled={isGenerating} 
                      onClick={() => {
                        setShowFeedbackInput(false);
                        setFeedbackText("");
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline"
                      disabled={isGenerating} 
                      className="px-6"
                      onClick={() => {
                        // This would handle regeneration in a real implementation
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
                    disabled={isGenerating} 
                    className="px-6"
                    onClick={() => {
                      setShowFeedbackInput(true);
                    }}
                  >
                    Suggest Edits
                  </Button>
                )}
                <Button 
                  disabled={isGenerating || isSending} 
                  className="px-6"
                  onClick={handleSendEmail}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating
                    </>
                  ) : isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
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
