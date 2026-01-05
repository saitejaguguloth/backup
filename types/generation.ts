export interface GenerateRequest {
    prompt: string;
}

export interface GenerateResponse {
    code: string;
    error?: string;
}

export interface EditRequest {
    existingCode: string;
    command: string;
}

export interface EditResponse {
    code: string;
    error?: string;
}

export interface UploadSketchRequest {
    file: File;
}

export interface UploadSketchResponse {
    url: string;
    error?: string;
}

export interface GeminiConfig {
    model: string;
    maxOutputTokens: number;
    temperature: number;
}

export interface GenerationError {
    code: string;
    message: string;
    details?: string;
}
