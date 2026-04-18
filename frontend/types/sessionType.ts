

export interface SessionData {
 user : {
        
        exp : number,
        id : number,
        init : number
    },
  expires: string;       
  accessToken: string;   
  refreshToken: string;  

}