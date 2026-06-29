import { supabase } from "../lib/supabase";

const API_URL = import.meta.env.VITE_API_URL;

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

export async function getProjects() {
    const { data: { session } } = await supabase.auth.getSession();
    const headers = { "Content-Type": "application/json" };
    if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
    }

    const response = await fetch(`${API_URL}/projects`, { headers });
    if (!response.ok) throw new Error("Failed to fetch projects");
    return response.json();
}

export async function getProject(id) {
    const { data: { session } } = await supabase.auth.getSession();
    const headers = { "Content-Type": "application/json" };
    if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
    }

    const response = await fetch(`${API_URL}/projects/${id}`, { headers });
    if (!response.ok) throw new Error("Failed to fetch project");
    return response.json();
}