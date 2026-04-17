// lib/axios.ts
import axios from "axios";

// Create a .env.local file with: NEXT_PUBLIC_API_URL=/api
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

