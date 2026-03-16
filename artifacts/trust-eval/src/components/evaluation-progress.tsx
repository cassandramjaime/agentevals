import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, XCircle, CheckCircle2, XCircle as XCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import type { EvaluationProgress as ProgressType, CompletedScenario } from "@/hooks/use-evaluation";

interface EvaluationProgressProps {
  progress: ProgressType;
  completedScenarios: CompletedScenario[];
  message: string;
  onCancel: () => void;
}

export function EvaluationProgress({ progress, completedScenarios, message, onCancel }: EvaluationProgressProps) {
  const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [completedScenarios.length]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-xl mx-auto text-center"
    >
      <div className="glass-card rounded-3xl p-12 relative overflow-hidden flex flex-col items-center">
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
            
            {completedScenarios.length > 0 && (
              <div className="w-full max-h-48 overflow-y-auto rounded-lg border border-white/5 bg-black/20 mb-6 scrollbar-thin">
                <div className="divide-y divide-white/5">
                  <AnimatePresence initial={false}>
                    {completedScenarios.map((scenario, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3 px-3 py-2 text-left text-sm"
                      >
                        {scenario.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircleIcon className="w-4 h-4 text-destructive shrink-0" />
                        )}
                        <span className="truncate text-gray-300">{scenario.name}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={logEndRef} />
                </div>
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
