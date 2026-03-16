import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Key, Link as LinkIcon, Bot, ChevronDown, Plus, Trash2, Settings2, MessageSquare } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

const formSchema = z.object({
  agentEndpoint: z.string().url("Must be a valid URL"),
  claudeApiKey: z.string().min(1, "API Key is required"),
  agentDescription: z.string().min(10, "Description should be at least 10 characters"),
  headers: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).optional(),
  requestTemplate: z.string().optional(),
  agentPrompt: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EvaluationFormProps {
  onSubmit: (data: {
    agentEndpoint: string;
    claudeApiKey: string;
    agentDescription: string;
    customHeaders?: Record<string, string>;
    requestTemplate?: string;
    agentPrompt?: string;
  }) => void;
}

export function EvaluationForm({ onSubmit }: EvaluationFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agentEndpoint: "",
      claudeApiKey: "",
      agentDescription: "Qualifies inbound sales leads, asks discovery questions, and routes them to the right rep.",
      headers: [],
      requestTemplate: "",
      agentPrompt: "You are a sales agent that qualifies inbound leads, asks discovery questions, and routes them to the right rep.",
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "headers",
  });

  function handleFormSubmit(data: FormValues) {
    const customHeaders: Record<string, string> = {};
    if (data.headers) {
      for (const h of data.headers) {
        if (h.key.trim() && h.value.trim()) {
          customHeaders[h.key.trim()] = h.value.trim();
        }
      }
    }

    onSubmit({
      agentEndpoint: data.agentEndpoint,
      claudeApiKey: data.claudeApiKey,
      agentDescription: data.agentDescription,
      customHeaders: Object.keys(customHeaders).length > 0 ? customHeaders : undefined,
      requestTemplate: data.requestTemplate?.trim() || undefined,
      agentPrompt: data.agentPrompt?.trim() || undefined,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="glass-card rounded-2xl p-8 md:p-10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="mb-8">
          <h2 className="text-2xl font-display font-semibold text-white mb-2">Configure Evaluation</h2>
          <p className="text-muted-foreground text-sm">
            Provide your agent details to run 20 synthetic adversarial scenarios.
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors w-full"
            >
              <Settings2 className="w-4 h-4" />
              <span>Advanced API Configuration</span>
              <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-5 pt-4 border-t border-white/5 mt-3">
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-sm">
                        Custom Headers
                      </Label>
                      <p className="text-xs text-muted-foreground -mt-1">
                        Add custom headers like API keys or version headers (e.g., x-api-key, anthropic-version).
                      </p>
                      <div className="space-y-2">
                        {fields.map((field, index) => (
                          <div key={field.id} className="flex gap-2 items-center">
                            <Input
                              placeholder="Header name"
                              className="flex-1"
                              {...register(`headers.${index}.key`)}
                            />
                            <Input
                              placeholder="Value"
                              className="flex-1"
                              {...register(`headers.${index}.value`)}
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-2 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ key: "", value: "" })}
                        className="text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Header
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requestTemplate" className="text-sm">
                        Request Body Template
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        JSON template for the request body. Use {"{{INPUT}}"} where the test input should be inserted and {"{{PROMPT}}"} for the agent system prompt.
                      </p>
                      <Textarea
                        id="requestTemplate"
                        placeholder={'{"model": "claude-sonnet-4-20250514", "max_tokens": 1024, "system": "{{PROMPT}}", "messages": [{"role": "user", "content": "{{INPUT}}"}]}'}
                        className="font-mono text-xs min-h-[100px]"
                        {...register("requestTemplate")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agentPrompt" className="flex items-center gap-2 text-sm">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        Agent Prompt
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        System prompt that defines the agent's behavior. Replaces {"{{PROMPT}}"} in the request template.
                      </p>
                      <Textarea
                        id="agentPrompt"
                        placeholder="You are a sales agent that qualifies inbound leads, asks discovery questions, and routes them to the right rep."
                        className="min-h-[80px]"
                        {...register("agentPrompt")}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-4">
            <Button type="submit" size="lg" className="w-full group" disabled={isSubmitting}>
              <Play className="w-5 h-5 mr-2 fill-current group-hover:scale-110 transition-transform" />
              Run Evaluation
            </Button>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500/50 border border-emerald-500"></span>
              Estimated cost: ~$1-2 per evaluation (BYOLLM)
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
