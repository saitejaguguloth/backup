"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { IconSend } from "./StudioIcons";

interface Message {
    id: string;
    type: "user" | "system";
    content: string;
    timestamp: Date;
}

interface EditChatProps {
    onEdit: (command: string) => Promise<void>;
    isProcessing: boolean;
}

export default function EditChat({ onEdit, isProcessing }: EditChatProps) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isProcessing) return;

        const command = input.trim();
        setInput("");

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            type: "user",
            content: command,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        try {
            await onEdit(command);

            // Add system acknowledgment
            const systemMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: "system",
                content: "Updated. Preview refreshed.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, systemMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: "system",
                content: "Failed to apply changes.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/[0.06]">
                <h2 className="text-sm font-medium text-white">Edit Commands</h2>
                <p className="text-xs text-white/40 mt-1">
                    Enter commands to modify the UI
                </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-6 space-y-4">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-sm text-white/30 mb-4">
                                Enter edit commands
                            </p>
                            <div className="space-y-2 text-xs text-white/20">
                                <p>Increase card spacing</p>
                                <p>Add subtle hover glow</p>
                                <p>Make header more premium</p>
                                <p>Reduce visual noise</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`${message.type === "user"
                                    ? "text-white/80"
                                    : "text-white/40"
                                }`}
                        >
                            <p className="text-sm">{message.content}</p>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/[0.06]">
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isProcessing}
                        placeholder="Enter edit command..."
                        className="flex-1 px-4 py-3 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isProcessing}
                        className="p-3 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        {isProcessing ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            />
                        ) : (
                            <IconSend size={16} />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
