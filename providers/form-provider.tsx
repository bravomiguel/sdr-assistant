"use client";

import React, { createContext, useContext } from "react";
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
} | null>(null);

export function FormProvider({ children }: FormProviderProps) {
  const { resetActiveThread } = useThreads();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleNewForm = () => {
    form.reset(defaultValues);
    resetActiveThread();
  };

  return (
    <FormContext.Provider value={{ form, handleNewForm }}>
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
