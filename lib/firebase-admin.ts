import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getStorage, Storage } from "firebase-admin/storage";

let app: App | null = null;
let authInstance: Auth | null = null;
let storageInstance: Storage | null = null;

function getFirebaseAdmin(): App {
    if (app) {
        return app;
    }

    const existingApps = getApps();
    if (existingApps.length > 0) {
        app = existingApps[0];
        return app;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error("Firebase Admin credentials not configured");
    }

    app = initializeApp({
        credential: cert({
            projectId,
            clientEmail,
            privateKey,
        }),
        storageBucket,
    });

    return app;
}

export function getAdminAuth(): Auth {
    if (authInstance) {
        return authInstance;
    }

    getFirebaseAdmin();
    authInstance = getAuth();
    return authInstance;
}

export function getAdminStorage(): Storage {
    if (storageInstance) {
        return storageInstance;
    }

    getFirebaseAdmin();
    storageInstance = getStorage();
    return storageInstance;
}

export async function verifyIdToken(token: string): Promise<{ uid: string; email?: string }> {
    const auth = getAdminAuth();
    const decodedToken = await auth.verifyIdToken(token);
    return {
        uid: decodedToken.uid,
        email: decodedToken.email,
    };
}

export async function uploadToStorage(
    buffer: Buffer,
    fileName: string,
    contentType: string
): Promise<string> {
    const storage = getAdminStorage();
    const bucket = storage.bucket();
    const file = bucket.file(`sketches/${fileName}`);

    await file.save(buffer, {
        metadata: {
            contentType,
        },
    });

    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    return publicUrl;
}

export async function deleteFromStorage(fileName: string): Promise<void> {
    const storage = getAdminStorage();
    const bucket = storage.bucket();
    const file = bucket.file(`sketches/${fileName}`);
    await file.delete();
}
