import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";

import { ApiError, ApiRequest, FetchResponse } from "@/models";

export const useFetch = () => {
  const [loading, setLoading] = useState<boolean>(false);
  let controller: AbortController | null = null;

  const callEndPoint = async (
    axiosRequest: ApiRequest,
    adapter?: (data: any) => any,
  ): Promise<FetchResponse> => {
    const response: FetchResponse = { data: null, error: null };

    if (axiosRequest.controller) controller = axiosRequest.controller;
    setLoading(true);

    try {
      const result: AxiosResponse = await axiosRequest.call;
      if (result && result.data !== undefined) {
        response.data = adapter ? adapter(result.data) : result.data;
      }
    } catch (error) {
      response.error = error as ApiError;
    } finally {
      setLoading(false);
    }
    return response;
  };

  const cancelEndPoint = () => {
    setLoading(false);
    if (controller) controller.abort();
  };

  useEffect(() => {
    return () => {
      cancelEndPoint();
    };
  }, []);

  return { loading, callEndPoint };
};
