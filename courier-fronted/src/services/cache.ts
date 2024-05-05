
export const Cache = (() => {

    const store: Record<string, unknown> = {};

    const getValue = (key: string) => store[key];

    const setValue = (key: string, value: unknown) => store[key] = value;

    const invalidateValue = (key: string) => delete store[key];

    const clearStore = () => Object.keys(store).forEach((key) => delete store[key]);

    return {
        getValue,
        setValue,
        invalidateValue,
        clearStore
    }
})();