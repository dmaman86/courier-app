import { ApiRequest } from "@/models";
import { apiService } from "./api-service";

const loadAbort = () => {
  const controller = new AbortController();
  return controller;
};

export const serviceRequest = (() => {
  const getItem = (url: string): ApiRequest => {
    const controller = loadAbort();
    return {
      call: apiService.get(url, { signal: controller.signal }),
      controller,
    };
  };

  const postItem = <D = object>(url: string, data?: D): ApiRequest => {
    const controller = loadAbort();
    return {
      call: apiService.post(url, data ? data : {}, {
        signal: controller.signal,
      }),
      controller,
    };
  };

  const putItem = <D = object>(url: string, data: D): ApiRequest => {
    const controller = loadAbort();
    return {
      call: apiService.put(url, data, { signal: controller.signal }),
      controller,
    };
  };

  const deleteItem = (url: string): ApiRequest => {
    const controller = loadAbort();
    return {
      call: apiService.delete(url, { signal: controller.signal }),
      controller,
    };
  };

  return {
    getItem,
    postItem,
    putItem,
    deleteItem,
  };
})();
