import { useState, useCallback } from "react";

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const useApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async (config: AxiosRequestConfig): Promise<any> => {
      const token = localStorage.getItem("token");

      try {
        setLoading(true);
        setError(null);

        const response: AxiosResponse = await axios({
          ...config,
          headers: {
            ...config.headers,
            Authorization: token ? `Bearer ${token}` : undefined
          }
        });

        return response.data;
      } catch (err: any) {
        setError(err.response?.data?.error || "An error occurred");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const get = (url: string) => request({ method: "GET", url });
  const post = (url: string, data: any) =>
    request({ method: "POST", url, data });
  const put = (url: string, data: any) => request({ method: "PUT", url, data });
  const del = (url: string) => request({ method: "DELETE", url });

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    delete: del
  };
};
