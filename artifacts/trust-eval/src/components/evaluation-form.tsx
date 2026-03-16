import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Play, Key, Link as LinkIcon, Bot } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

const formSchema = z.object({
  agentEndpoint: z.string().url("Must be a valid URL"),
  claudeApiKey: z.string().min(1, "API Key is required"),
  agentDescription: z.string().min(10, "Description should be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface EvaluationFormProps {
  onSubmit: (data: FormValues) => void;
}

export function EvaluationForm({ onSubmit }: EvaluationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agentEndpoint: "",
      claudeApiKey: "",
      agentDescription: "",
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="glass-card rounded-2xl p-8 md:p-10 relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="mb-8">
          <h2 className="text-2xl font-display font-semibold text-white mb-2">Configure Evaluation</h2>
          <p className="text-muted-foreground text-sm">
            Provide your agent details to run 100 synthetic adversarial scenarios.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2 relative">
            <Label htmlFor="agentEndpoint" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-primary" />
              Agent API Endpoint
            </Label>
            <Input
              id="agentEndpoint"
              placeholder="https://api.mycompany.com/agent/invoke"
              {...register("agentEndpoint")}
            />
            {errors.agentEndpoint && (
              <p className="text-destructive text-xs mt-1 absolute -bottom-5 left-0">{errors.agentEndpoint.message}</p>
            )}
          </div>

          <div className="space-y-2 relative pt-2">
            <Label htmlFor="claudeApiKey" className="flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              Claude API Key
            </Label>
            <Input
              id="claudeApiKey"
              type="password"
              placeholder="sk-ant-api03-..."
              {...register("claudeApiKey")}
            />
            {errors.claudeApiKey && (
              <p className="text-destructive text-xs mt-1 absolute -bottom-5 left-0">{errors.claudeApiKey.message}</p>
            )}
          </div>

          <div className="space-y-2 relative pt-2">
            <Label htmlFor="agentDescription" className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              Agent Description
            </Label>
            <Textarea
              id="agentDescription"
              placeholder="Qualifies inbound sales leads, asks discovery questions, and routes them to the right rep."
              {...register("agentDescription")}
            />
            {errors.agentDescription && (
              <p className="text-destructive text-xs mt-1 absolute -bottom-5 left-0">{errors.agentDescription.message}</p>
            )}
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-4">
            <Button type="submit" size="lg" className="w-full group" disabled={isSubmitting}>
              <Play className="w-5 h-5 mr-2 fill-current group-hover:scale-110 transition-transform" />
              Run 100 Scenarios
            </Button>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500/50 border border-emerald-500"></span>
              Estimated cost: ~$3-5 per evaluation (BYOLLM)
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
