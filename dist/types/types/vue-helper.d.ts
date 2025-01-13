declare type NotUndefined<T> = T extends undefined ? never : T;
declare type InferDefault<T> = T extends null | number | string | boolean | symbol | Function ? T : () => T;
export declare type InferDefaults<T> = {
    [K in keyof T]?: InferDefault<NotUndefined<T[K]>>;
};
export {};
