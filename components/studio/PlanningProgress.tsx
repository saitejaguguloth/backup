"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IconCheck } from "./StudioIcons";

export interface PlanningStep {
    id: string;
    label: string;
    status: "pending" | "active" | "complete";
    detail?: string;
}

interface PlanningProgressProps {
    steps: PlanningStep[];
    isVisible: boolean;
}

export function PlanningProgress({ steps, isVisible }: PlanningProgressProps) {
    if (!isVisible || steps.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/5 rounded-xl border border-white/10 p-6"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/40 border-t-transparent rounded-full"
                    />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-white">Planning</h3>
                    <p className="text-xs text-white/40">Analyzing your design...</p>
                </div>
            </div>

            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${step.status === "active"
                                    ? "bg-white/10"
                                    : step.status === "complete"
                                        ? "bg-white/5"
                                        : "bg-transparent"
                                }`}
                        >
                            {/* Status Icon */}
                            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                                {step.status === "complete" ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-5 h-5 rounded-full bg-white flex items-center justify-center"
                                    >
                                        <IconCheck size={12} className="text-black" />
                                    </motion.div>
                                ) : step.status === "active" ? (
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="w-5 h-5 rounded-full bg-white/40 flex items-center justify-center"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                    </motion.div>
                                ) : (
                                    <div className="w-5 h-5 rounded-full border border-white/20" />
                                )}
                            </div>

                            {/* Label */}
                            <p className={`text-sm ${step.status === "active"
                                    ? "text-white"
                                    : step.status === "complete"
                                        ? "text-white/60"
                                        : "text-white/30"
                                }`}>
                                {step.label}
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export const DEFAULT_PLANNING_STEPS: PlanningStep[] = [
    { id: "layout", label: "Analyzing layout structure", status: "pending" },
    { id: "pages", label: "Detecting page hierarchy", status: "pending" },
    { id: "components", label: "Identifying components", status: "pending" },
    { id: "colors", label: "Inferring color palette", status: "pending" },
    { id: "typography", label: "Planning typography", status: "pending" },
    { id: "interactions", label: "Designing interactions", status: "pending" },
];
