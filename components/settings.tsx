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
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Settings() {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (open) {
      const storedApiKey = localStorage.getItem("openai_api_key");
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
    }
  }, [open]);

  const handleSave = () => {
    localStorage.setItem("openai_api_key", apiKey);
    toast.success("API key saved.");
    setOpen(false);
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
        <DialogFooter>
          <Button onClick={handleSave} disabled={apiKey.length === 0}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
