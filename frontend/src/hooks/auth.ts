import { AxiosResponse } from "axios";
import { useState } from "react";
import { ILOGINRESPONSE, IPAYLOAD } from "../@types";
import { instance } from "../config";
export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const signup = async (payload: IPAYLOAD): Promise<AxiosResponse<ILOGINRESPONSE> | any> => {
    try {
      setLoading(true);
      const response = await instance.post("/auth/signup", payload);
      return response?.data;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload: IPAYLOAD): Promise<AxiosResponse<ILOGINRESPONSE> | any> => {
    try {
      setLoading(true);
      const response = await instance.post("/auth/login", payload);
      return response?.data;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signup,
    login,
  };
};