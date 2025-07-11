"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { ProspectForm } from "@/components/prospect-form";

export default function Home() {
  const [resetFormKey, setResetFormKey] = useState(0);
  
  const handleResetForm = () => {
    // Increment the key to force the form component to remount
    setResetFormKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="max-w-md w-full bg-background flex flex-col h-screen">
        <div className="flex flex-col h-full">
          <Header onNewForm={handleResetForm} />
          <main className="flex-1 p-4 w-full overflow-hidden">
            <ProspectForm key={resetFormKey} />
          </main>
        </div>
      </div>
    </div>
  );
}
