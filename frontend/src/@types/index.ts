export interface IRECIPE {
    category?: string;
    title: string;
    description: string;
    note?: string;
    ingredients: string;
  }
  
  export interface IRECIPEPAYLOAD extends IRECIPE {
    image: File;
  }
  
  export interface IRECIPERESPONSE extends IRECIPE {
    _id: string;
    image: IIMAGE;
    user: {
      email: string;
    };
  }
  
  export interface IRECIPEUSER extends Omit<IRECIPERESPONSE, "user"> {
    user: string;
  }
  
  export interface SEARCHRESPONSE {
    data: IRECIPERESPONSE;
  }
  
  export interface ILOGINRESPONSE {
    username: string;
    email: string;
    token: string;
    id: string;
  }
  
  export interface IPAYLOAD {
    username?: string;
    identifier?: string;
    email?: string;
    password: string;
  }
  export interface AUTH_TYPE {
    user: string;
    loading: boolean;
    onSignup: (payload: IPAYLOAD) => Promise<unknown>;
    onLogin: (payload: IPAYLOAD) => void;
    onLogout: () => void;
  }
  
  export interface IIMAGE {
    url: string;
    id: string;
  }