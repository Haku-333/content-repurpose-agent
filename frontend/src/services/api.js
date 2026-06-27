import { supabase } from "../lib/supabase";

const API_URL = "http://localhost:8000";

export async function generateContent(content, platform) {
    const { data: { session } } = await supabase.auth.getSession();
    const headers = {
        "Content-Type": "application/json",
    };
    
    if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
    }

    const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers,
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