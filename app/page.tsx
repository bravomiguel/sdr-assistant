"use client";

import { Header } from "@/components/header";
import { ProspectForm } from "@/components/prospect-form";
import { StickyContainer } from "@/components/sticky-container";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="max-w-md w-full bg-background flex flex-col h-screen">
        <StickyContainer>
          <div className="flex flex-col h-full">
            <Header />
            <main className="flex-1 p-4 w-full overflow-hidden">
              <ProspectForm />
            </main>
          </div>
        </StickyContainer>
      </div>
    </div>
  );
}
