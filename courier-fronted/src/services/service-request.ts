import { loadAbort } from "../helpers";
import { service } from "./api";


export const serviceRequest = (() => {

    const getItem = <T>(url: string) => {
        const controller = loadAbort();
        return {
            call: service.get<T>(url, { signal: controller.signal }), controller
        }
    }

    const postItem = <R = void, D = object>(url: string, data?: D) => {
        const controller = loadAbort();
        return {
            call: service.post<R>(url, data ?? {}, { signal: controller.signal }), controller
        }
    }

    return {
        getItem,
        postItem
    }
})();