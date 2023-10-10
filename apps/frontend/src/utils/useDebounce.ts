interface Scheduled<Args extends unknown[]> {
    (...args: Args): void;
    clear: VoidFunction;
}


type DebounceCallback = <Args extends unknown[]>(
    callback: (...args: Args) => void,
    wait?: number,
) => Scheduled<Args>;

export const useDebounce: DebounceCallback = (callback, wait = 1000) => {
    let timeoutId: NodeJS.Timeout;
    const clear = () => clearTimeout(timeoutId);
    const debounced: typeof callback = (...args) => {
        if (timeoutId) clear();
        timeoutId = setTimeout(() => {
            callback(...args)
        }, wait);
    };
    return Object.assign(debounced, { clear });
};


