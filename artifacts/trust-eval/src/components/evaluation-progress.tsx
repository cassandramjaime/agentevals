import React from "react";
import { motion } from "framer-motion";
import { Activity, XCircle, CheckCircle2, XCircle as XCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import type { EvaluationProgress as ProgressType } from "@/hooks/use-evaluation";

interface EvaluationProgressProps {
  progress: ProgressType;
  message: string;
  onCancel: () => void;
}

export function EvaluationProgress({ progress, message, onCancel }: EvaluationProgressProps) {
  const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-xl mx-auto text-center"
    >
      <div className="glass-card rounded-3xl p-12 relative overflow-hidden flex flex-col items-center">
        {/* Pulsing background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 flex flex-col items-center w-full">
          <div className="w-24 h-24 mb-8 relative">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-white/5 stroke-current"
                strokeWidth="6"
                cx="50"
                cy="50"
                r="44"
                fill="transparent"
              ></circle>
              <motion.circle
                className="text-primary stroke-current"
                strokeWidth="6"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="44"
                fill="transparent"
                initial={{ strokeDasharray: "0 276" }}
                animate={{ strokeDasharray: `${(percentage / 100) * 276} 276` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              ></motion.circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-display font-bold">{percentage}%</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-primary mb-2">
            <Activity className="w-5 h-5 animate-pulse" />
            <h3 className="text-lg font-medium tracking-tight">Evaluating Trust Parameters</h3>
          </div>
          
          <p className="text-muted-foreground h-6">{message}</p>

          <div className="w-full mt-8 pt-8 border-t border-white/5 flex flex-col items-center">
            <div className="flex items-center justify-between w-full text-sm text-muted-foreground mb-4 px-4">
              <span>{progress.completed} scenarios complete</span>
              <span>{progress.total - progress.completed} remaining</span>
            </div>
            
            {progress.scenarioName && (
              <div className="w-full bg-black/20 rounded-lg p-3 border border-white/5 flex items-center gap-3 text-left text-sm mb-6">
                {progress.passed === true ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : progress.passed === false ? (
                  <XCircleIcon className="w-4 h-4 text-destructive shrink-0" />
                ) : (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
                )}
                <span className="truncate text-gray-300">{progress.scenarioName}</span>
              </div>
            )}

            <Button variant="ghost" onClick={onCancel} className="text-muted-foreground hover:text-white">
              <XCircle className="w-4 h-4 mr-2" />
              Cancel Evaluation
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
