'use client';

import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useFormContext } from "@/providers/form-provider";

export function Header() {
  const { handleNewForm } = useFormContext();

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={handleNewForm}
      >
        <Plus className="h-5 w-5" />
        <span className="sr-only">New Form</span>
      </Button>

      <h1 className="text-lg font-semibold">SDR Assistant</h1>

      <Avatar>
        <AvatarImage src="/avatar.png" alt="User" />
        <AvatarFallback>W</AvatarFallback>
      </Avatar>
    </header>
  );
}
