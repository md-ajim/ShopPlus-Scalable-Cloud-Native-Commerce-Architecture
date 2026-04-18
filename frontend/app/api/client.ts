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



import axios from "axios";
import { getSession } from "next-auth/react"; 

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/";

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, 
});

api.interceptors.request.use(
  async (config) => {

    const session = await getSession();
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

// এটি ম্যানুয়ালি টোকেন সেট করার জন্য রাখা যেতে পারে 
// export const setAuthToken = (token?: string) => {
//   if (token) {
//     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     delete api.defaults.headers.common["Authorization"];
//   }
// };