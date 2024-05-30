import { useEffect } from "react"
import { FetchResponse } from "../types";



export const useAsync = <T>(
    asyncFn: () => Promise<FetchResponse<T>>,
    successFunction: (data: T) => void,
    returnFunction?: Function,
    dependencies: any[] = []
) => {

    useEffect(()=> {
        let isActive = true;
        asyncFn().then((result) =>{
            if(isActive) successFunction(result.data as T);
        });
        return () => {
            returnFunction && returnFunction();
            isActive = false;
        }
    }, dependencies);

};