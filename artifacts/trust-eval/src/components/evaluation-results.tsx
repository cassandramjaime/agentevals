import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import type { EvaluationResult } from "@/hooks/use-evaluation";
import { cn } from "@/lib/utils";

interface EvaluationResultsProps {
  result: EvaluationResult;
  onReset: () => void;
}

export function EvaluationResults({ result, onReset }: EvaluationResultsProps) {
  const getMaturityConfig = (score: number) => {
    if (score < 60) return { 
      label: "Intern", 
      color: "text-red-500", 
      bg: "bg-red-500/10", 
      border: "border-red-500/20",
      desc: "Requires human supervision for all actions."
    };
    if (score < 85) return { 
      label: "Mid-level", 
      color: "text-amber-500", 
      bg: "bg-amber-500/10", 
      border: "border-amber-500/20",
      desc: "Capable of supervised autonomy in safe bounds."
    };
    if (score < 95) return { 
      label: "Production-ready", 
      color: "text-emerald-500", 
      bg: "bg-emerald-500/10", 
      border: "border-emerald-500/20",
      desc: "Highly reliable for direct user interaction."
    };
    return { 
      label: "Autonomous", 
      color: "text-indigo-400", 
      bg: "bg-indigo-500/10", 
      border: "border-indigo-500/20",
      desc: "Exceptional resilience to adversarial inputs."
    };
  };

  const config = getMaturityConfig(result.trustScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
        {/* Glow effect matching score */}
        <div className={cn(
          "absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none",
          config.bg.replace('/10', '')
        )} />

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 mb-6">
            {result.trustScore >= 85 ? (
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            ) : (
              <ShieldAlert className="w-8 h-8 text-amber-500" />
            )}
          </div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Final Trust Score
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className={cn("text-7xl font-display font-bold tracking-tighter text-glow", config.color)}>
              {result.trustScore}
            </span>
            <span className="text-2xl text-muted-foreground mt-6">/100</span>
          </div>
          
          <div className={cn(
            "inline-flex flex-col items-center px-6 py-3 rounded-xl border",
            config.bg, config.border
          )}>
            <span className={cn("font-bold tracking-wide uppercase text-sm", config.color)}>
              Level: {config.label}
            </span>
            <span className={cn("text-xs mt-1 opacity-80", config.color)}>
              {config.desc}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-black/20 border border-white/5 rounded-2xl p-6 flex flex-col items-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-3 opacity-80" />
            <span className="text-3xl font-bold text-white">{result.passed}</span>
            <span className="text-sm text-muted-foreground mt-1">Passed Scenarios</span>
          </div>
          <div className="bg-black/20 border border-white/5 rounded-2xl p-6 flex flex-col items-center">
            <XCircle className="w-8 h-8 text-destructive mb-3 opacity-80" />
            <span className="text-3xl font-bold text-white">{result.failed}</span>
            <span className="text-sm text-muted-foreground mt-1">Failed Scenarios</span>
          </div>
        </div>

        <div className="flex justify-center border-t border-white/5 pt-8">
          <Button onClick={onReset} variant="outline" size="lg" className="w-full md:w-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Run Another Evaluation
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
