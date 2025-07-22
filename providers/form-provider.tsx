"use client";

import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";

import { formSchema } from "@/lib/schemas";
import { FormValues } from "@/lib/types";
import { defaultValues } from "@/lib/constants";
import { useThreads } from "./thread-provider";

type FormProviderProps = {
  children: React.ReactNode;
};

const FormContext = createContext<{
  form: UseFormReturn<FormValues>;
  handleNewForm: () => void;
  toEmail: string;
  isInitGen: boolean;
  setIsInitGen: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export function FormProvider({ children }: FormProviderProps) {
  const [isInitGen, setIsInitGen] = useState(false);
  const { resetActiveThread } = useThreads();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const toEmail = form.watch("email");

  const handleNewForm = () => {
    setIsInitGen(false);
    form.reset(defaultValues);
    resetActiveThread();
  };

  return (
    <FormContext.Provider
      value={{ form, handleNewForm, toEmail, isInitGen, setIsInitGen }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
