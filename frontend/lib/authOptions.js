

// import axios from "axios";

// import CredentialsProvider from "next-auth/providers/credentials";

// import { jwtDecode } from "jwt-decode";

// import GoogleProvider from "next-auth/providers/google";


// async function refreshAccessToken(refreshToken) {
//   try {
//     const response = await axios.post(`/api/token/refresh/`, {
//       refresh: refreshToken,
//     });
//     const { access, refresh } = response.data;
//     return {
//       access,
//       refresh,
//     };
//   } catch (error) {
//     console.error(
//       "refresh token input invalid",
//       error.response.data || error.message
//     );
//     return null;
//   }
// }

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       authorization: {
//         params: {
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code",
//         },
//       },
//       // This helps bypass the "State cookie was missing" error on HTTP
//       checks: ['none'], 
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         try {
//           const response = await axios.post("/api/login/", {
//             username: credentials.username,
//             password: credentials.password,
//           });
//           const { access, refresh } = response.data;
//           const decoded = jwtDecode(access);

//           return {
//             id: decoded.user_id,
//             accessToken: access,
//             refreshToken: refresh,
//             user_id: decoded.user_id,
//           };
//         } catch (error) {
//           throw new Error("Invalid credentials");
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account, profile }) {
//       if (account.provider === "google") {
//         try {
//           const response = await axios.post("/api/social-login/", {
//             provider: "google-oauth2",
//             access_token: account.access_token,
//           });
//           account.meta = response.data; // Attach Django tokens to account
          
//           return true;
//         } catch (error) {
//           console.error("Social Login Backend Error:", error);
//           return false;
//         }
//       }
//       return true;
//     },

//     async jwt({ token, user, account }) {
//       // Initial sign in
//       if (account && user) {
//         if (account.provider === "google") {
//           token.accessToken = account.meta.access;
//           token.refreshToken = account.meta.refresh;
//           token.user_id = account.meta.user_id;
//         } else {
//           token.accessToken = user.accessToken;
//           token.refreshToken = user.refreshToken;
//           token.user_id = user.id;
//         }
        
//         const decoded = jwtDecode(token.accessToken);
//         token.exp = decoded.exp;
//       }

//       // Check token expiration
//       if (Date.now() < token.exp * 1000) {
//         return token;
//       }

//       // Token expired, refresh it
//       return await refreshAccessToken(token.refreshToken);
//     },

//     async session({ session, token }) {
//       session.accessToken = token.accessToken;
//       session.user.id = token.user_id;
//       return session;
//     },
//   },
//   useSecureCookies: false, // Required for HTTP
//   pages: {
//     signIn: "/form/login",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };


// lib/authOptions.js
import axios from "axios";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import GoogleProvider from "next-auth/providers/google";

// Define your internal backend URL for server-to-server calls

const BACKEND_URL = process.env.INTERNAL_BACKEND_URL || "https://airfm9n2a7.execute-api.us-east-1.amazonaws.com/dev";

async function refreshAccessToken(refreshToken) {
  try {
    // Use the absolute internal URL
    const response = await axios.post(`${BACKEND_URL}/api/token/refresh/`, {
      refresh: refreshToken,
    });
    const { access, refresh } = response.data;
    return { access, refresh };
  } catch (error) {
    console.error(
      "refresh token input invalid",
      error.response?.data || error.message
    );
    return null;
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      checks: ['none'], 
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Use the absolute internal URL here!
          const response = await axios.post(`${BACKEND_URL}/api/login/`, {
            username: credentials.username,
            password: credentials.password,
          });
          
          const { access, refresh } = response.data;
          const decoded = jwtDecode(access);

          return {
            id: decoded.user_id,
            accessToken: access,
            refreshToken: refresh,
            user_id: decoded.user_id,
          };
        } catch (error) {
          console.error("Login Error:", error.response?.data || error.message);
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        try {
          // Use the absolute internal URL here!
          const response = await axios.post(`${BACKEND_URL}/api/social-login/`, {
            provider: "google-oauth2",
            access_token: account.access_token,
          });
          account.meta = response.data; 
          return true;
        } catch (error) {
          console.error("Social Login Backend Error:", error.response?.data || error.message);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (account && user) {
        if (account.provider === "google") {
          token.accessToken = account.meta.access;
          token.refreshToken = account.meta.refresh;
          token.user_id = account.meta.user_id;
        } else {
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.user_id = user.id;
        }
        
        const decoded = jwtDecode(token.accessToken);
        token.exp = decoded.exp;
      }

      if (Date.now() < token.exp * 1000) {
        return token;
      }

      return await refreshAccessToken(token.refreshToken);
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.user_id;
      return session;
    },
  },
  useSecureCookies: false, // Required for HTTP
  pages: {
    signIn: "/form/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};