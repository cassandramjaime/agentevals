import React from "react";
import { AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";
import { useEvaluation } from "@/hooks/use-evaluation";
import { EvaluationForm } from "@/components/evaluation-form";
import { EvaluationProgress } from "@/components/evaluation-progress";
import { EvaluationResults } from "@/components/evaluation-results";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const { status, progress, completedScenarios, currentMessage, result, error, start, cancel, reset } = useEvaluation();

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image injected via App CSS or standard img tag. Handled gracefully. */}
      <div 
        className="fixed inset-0 z-[-1] opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/dark-abstract-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <header className="w-full border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/20 p-1.5 rounded-lg border border-primary/30">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-xl font-display font-bold tracking-tight text-white">AgentTrust</h1>
          </div>
          <div className="hidden md:flex text-sm text-muted-foreground">
            Evaluate your AI agent's trustworthiness in minutes
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 py-12 md:py-24">
        
        {error && status === "error" && (
          <div className="w-full max-w-xl mx-auto mb-8">
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive-foreground glass-card">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Evaluation Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <AnimatePresence mode="wait">
          {(status === "idle" || status === "error") && (
            <EvaluationForm key="form" onSubmit={start} />
          )}

          {status === "running" && (
            <EvaluationProgress 
              key="progress" 
              progress={progress} 
              completedScenarios={completedScenarios}
              message={currentMessage} 
              onCancel={cancel} 
            />
          )}

          {status === "complete" && result && (
            <EvaluationResults key="results" result={result} onReset={reset} />
          )}
        </AnimatePresence>

      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-white/5 bg-black/20">
        <p>Enterprise AI Trust Infrastructure &bull; Local stateless evaluation</p>
      </footer>
    </div>
  );
}
