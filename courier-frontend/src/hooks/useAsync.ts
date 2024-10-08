import { useEffect } from "react";

import { FetchResponse } from "../domain";


export const useAsync = <T>(
    asyncFn: () => Promise<FetchResponse<T>>,
    successFunction: (data: FetchResponse<T>) => void,
    returnFunction?: Function,
    dependencies: any[] = []
) => {

    useEffect(()=> {
        let isActive = true;
        asyncFn().then((result) =>{
            if(isActive) {
                successFunction(result);
            }
        });
        return () => {
            returnFunction && returnFunction();
            isActive = false;
        }
    }, dependencies);

};