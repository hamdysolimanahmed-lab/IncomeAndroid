import { MOCK_DATA } from './mockData';

// REPLACE THIS WITH YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL
// You can set this in a .env file as VITE_API_URL=https://script.google.com/...
const API_URL = import.meta.env.VITE_API_URL || "";

export async function fetchData() {
    if (!API_URL) {
        console.warn("No API URL provided, using mock data.");
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return MOCK_DATA;
    }

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch data:", error);
        throw error;
    }
}
