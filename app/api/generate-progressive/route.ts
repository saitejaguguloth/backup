import { NextRequest } from "next/server";
import { runProgressivePipeline, PipelineStage, PipelineConfig } from "@/lib/pipeline/progressivePipeline";

export const maxDuration = 120; // 2 minutes max
export const dynamic = 'force-dynamic';

interface StreamingRequest {
    imageBase64: string;
    mimeType: string;
    config: PipelineConfig;
}

/**
 * Streaming API for progressive generation
 * Returns Server-Sent Events with stage updates
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as StreamingRequest;

        if (!body.imageBase64) {
            return new Response(JSON.stringify({ error: "Image required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!body.config?.techStack) {
            return new Response(JSON.stringify({ error: "Tech stack required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Create readable stream for SSE
        const encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller) {
                const sendEvent = (stage: PipelineStage) => {
                    const data = `data: ${JSON.stringify(stage)}\n\n`;
                    controller.enqueue(encoder.encode(data));
                };

                try {
                    // Run pipeline with progress callback
                    await runProgressivePipeline(
                        body.imageBase64,
                        body.mimeType || 'image/png',
                        body.config,
                        sendEvent
                    );

                    // Send done event
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    sendEvent({
                        stage: 'complete',
                        progress: 100,
                        error: errorMessage
                    });
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error("Streaming API Error:", error);
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error"
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
