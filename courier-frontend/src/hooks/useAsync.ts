import { FetchResponse } from "@/models";
import { useEffect } from "react";

export const useAsync = <T>(
  asyncRequest: () => Promise<FetchResponse<T>>,
  successFunction: (data: FetchResponse<T>) => void,
  returnFunction?: () => void,
  dependencies: any[] = [],
) => {
  useEffect(() => {
    let isActive = true;

    asyncRequest().then((result) => {
      if (isActive) {
        successFunction(result);
      }
    });
    return () => {
      returnFunction?.();
      isActive = false;
    };
  }, dependencies);
};
