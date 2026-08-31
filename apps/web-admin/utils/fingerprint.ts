/**
 * Utility to generate a unique browser fingerprint hash
 */
export async function getBrowserFingerprint(): Promise<string> {
    const components: string[] = [];

    // 1. User Agent & Language
    components.push(navigator.userAgent);
    components.push(navigator.language);

    // 2. Screen & Display Properties
    components.push(`${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`);
    components.push(`devicePixelRatio:${window.devicePixelRatio}`);

    // 3. Timezone & Locale
    components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

    // 4. Hardware Concurrency (Number of CPU cores)
    components.push(`cores:${navigator.hardwareConcurrency || "unknown"}`);

    // 5. Canvas Fingerprinting (Hardware/GPU Rendering signature)
    try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
            canvas.width = 200;
            canvas.height = 50;
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = "#069";
            ctx.fillText("MeejFingerprint#2026!", 2, 15);
            components.push(canvas.toDataURL());
        }
    } catch (e) {
        components.push("canvas-failed");
    }

    // 6. Combine all components into a single text string
    const rawString = components.join("||");

    // 7. Hash the string using native Web Crypto API (SHA-256)
    const encoder = new TextEncoder();
    const data = encoder.encode(rawString);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // Return Hex String Hash (e.g., "a3f5b902e...")
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}