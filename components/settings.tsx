"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RotateCcw, Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import { useStreamContext } from "@/providers/stream-provider";
import { toast } from "sonner";

export function Settings() {
  const [open, setOpen] = useState(false);
  const { apiKey, setApiKey, systemPrompt, setSystemPrompt, defaultConfig } =
    useStreamContext();

  const handleSave = () => {
    toast.success("Settings saved");
    setOpen(false);
  };

  const handleResetSystemPrompt = () => {
    setSystemPrompt(defaultConfig.system_prompt ?? "");
    toast.success("System prompt reset to default");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          {/* <DialogDescription>
            Enter your OpenAI API key. This is stored in your browser and never
            sent to our servers.
          </DialogDescription> */}
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label htmlFor="api-key" className="text-right">
            OpenAI API Key
          </Label>
          <Input
            id="api-key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
          />
        </div>

        {/* System Prompt Field */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="system-prompt">System Prompt</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetSystemPrompt}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            id="system-prompt"
            className="resize-none overflow-auto h-72"
            value={systemPrompt}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setSystemPrompt(e.target.value)
            }
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
