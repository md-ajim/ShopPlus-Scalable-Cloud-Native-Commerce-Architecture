

export interface SessionData {
 user : {
        
        exp : number,
        id : number,
        init : number
    },
  expires: string;       // ISO date string (e.g. "2025-08-26T11:51:18.411Z")
  accessToken: string;   // JWT access token
  refreshToken: string;  // JWT refresh token

}