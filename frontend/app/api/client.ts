// // api/client.ts
// import axios from "axios";
// import NextAuth from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// const auth = NextAuth.init(authOptions);



// export const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization : `Bearer ${auth.session?.accessToken}`
//   },
//   withCredentials: false,
// });

// // Optionally plug auth token dynamically
// export const setAuthToken = (token?: string) => {
//   if (token) {
//     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     delete api.defaults.headers.common["Authorization"];
//   }
// };


// api/client.ts
import axios from "axios";
import { getSession } from "next-auth/react"; // ক্লায়েন্ট সাইড সেশন হ্যান্ডলার

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/";

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // আপনার ব্যাকএন্ড কনফিগারেশনের উপর নির্ভর করে (CORS)
});

// Request Interceptor: প্রতিটি রিকোয়েস্ট পাঠানোর আগে এটি কল হবে
api.interceptors.request.use(
  async (config) => {
    // 1. সেশন থেকে টোকেন বের করা
    const session = await getSession();

    // 2. যদি টোকেন থাকে এবং হেডারে আগে থেকে সেট করা না থাকে, তবে সেট করা
    // আপনার টোকেন স্ট্রাকচার অনুযায়ী session.accessToken বা session.user.accessToken হতে পারে
    const token = session?.accessToken; 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// এটি ম্যানুয়ালি টোকেন সেট করার জন্য রাখা যেতে পারে (অপশনাল)
// export const setAuthToken = (token?: string) => {
//   if (token) {
//     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     delete api.defaults.headers.common["Authorization"];
//   }
// };