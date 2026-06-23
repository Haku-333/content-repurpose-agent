const API_URL = "http://localhost:8000";

export async function generateContent(content, platform) {
    const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content,
            platform,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to generate content");
    }

    return response.json();
}