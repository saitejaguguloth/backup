"use client";

import { motion } from "framer-motion";
import { IconCheck } from "./StudioIcons";
import { useEffect, useState } from "react";

export type GenerationStep = "analyzing" | "structure" | "styling" | "interactions" | "polishing" | "complete";

interface GenerationProgressProps {
    currentStep: GenerationStep;
}

const STEPS = [
    { id: "analyzing", label: "Analyzing layout..." },
    { id: "structure", label: "Building structure..." },
    { id: "styling", label: "Applying design system..." },
    { id: "interactions", label: "Adding interactions..." },
    { id: "polishing", label: "Final polish..." },
] as const;

export default function GenerationProgress({ currentStep }: GenerationProgressProps) {
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);

    useEffect(() => {
        const stepIndex = STEPS.findIndex(s => s.id === currentStep);
        if (stepIndex >= 0) {
            setCompletedSteps(STEPS.slice(0, stepIndex).map(s => s.id));
        }
    }, [currentStep]);

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 space-y-8">
            <div className="w-full max-w-xs space-y-4">
                {STEPS.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id);
                    const isCurrent = step.id === currentStep;
                    const isPending = !isCompleted && !isCurrent;

                    return (
                        <div key={step.id} className="flex items-center gap-4">
                            <div className="relative flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                {isCompleted ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-full h-full bg-white rounded-full flex items-center justify-center"
                                    >
                                        <IconCheck size={14} className="text-black" />
                                    </motion.div>
                                ) : isCurrent ? (
                                    <div className="w-full h-full relative">
                                        <motion.div
                                            className="absolute inset-0 border-2 border-white/30 rounded-full"
                                        />
                                        <motion.div
                                            className="absolute inset-0 border-2 border-white border-t-transparent rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-white/10 mx-auto" />
                                )}
                            </div>
                            <span className={`text-sm ${isCurrent ? "text-white font-medium" : isCompleted ? "text-white/60" : "text-white/20"}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
