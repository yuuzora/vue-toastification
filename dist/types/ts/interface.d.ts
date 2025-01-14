import type { ToastID } from "../types/common";
import type { BasePluginOptions, PluginOptions } from "../types/plugin";
import type { ToastContent, ToastOptions } from "../types/toast";
import { TYPE } from "./constants";
/**
 * Display a toast
 */
interface ToastMethod<T extends TYPE = TYPE> {
    /**
     * @param content Toast content.
     *
     * Can be a string, JSX or a custom component passed directly
     *
     * To provide props and listeners to the custom component, you
     * do so by providing an object with the following shape:
     *
     * ```ts
     * {
     *  component: JSX | VueComponent
     *  props: Record<string, unknown>
     *  listeners: Record<string, Function>
     * }
     * ```
     *
     * for more details, see https://github.com/Maronato/vue-toastification#toast-content-object
     *
     * @param options Toast configuration
     *
     * For details, see: https://github.com/Maronato/vue-toastification#toast-options-object
     *
     * @returns ID of the created toast
     */
    (content: ToastContent, options?: ToastOptions & {
        type?: T;
    }): ToastID;
}
interface DismissToast {
    /**
     * @param toastID ID of the toast to be dismissed
     */
    (toastID: ToastID): void;
}
interface ClearToasts {
    (): void;
}
interface UpdateDefaults {
    /**
     * @param update Plugin options to update
     *
     * Accepts all* options provided during plugin
     * registration and updates them.
     *
     * For details, see https://github.com/Maronato/vue-toastification#updating-default-options
     */
    (update: BasePluginOptions): void;
}
interface UpdateToast {
    /**
     * @param toastID ID of the toast to update
     * @param update Object that may contain the content to update, or the options to merge
     * @param create If set to false, this method only updates existing toasts and does
     * nothing if the provided `toastID` does not exist
     */
    (toastID: ToastID, update: {
        content?: ToastContent;
        options?: ToastOptions;
    }, create?: false): void;
    /**
     * @param toastID ID of the toast to create / update
     * @param update Object that must contain the toast content and may contain the options to merge
     * @param create If set to true, this method updates existing toasts or creates new toasts if
     * the provided `toastID` does not exist
     */
    (toastID: ToastID, update: {
        content: ToastContent;
        options?: ToastOptions;
    }, create: true): void;
}
export interface ToastInterface extends ToastMethod {
    /**
     * Display a success toast
     */
    success: ToastMethod<TYPE.SUCCESS>;
    /**
     * Display an info toast
     */
    info: ToastMethod<TYPE.INFO>;
    /**
     * Display a warning toast
     */
    warning: ToastMethod<TYPE.WARNING>;
    /**
     * Display an error toast
     */
    error: ToastMethod<TYPE.ERROR>;
    /**
     * Dismiss toast specified by an id
     */
    dismiss: DismissToast;
    /**
     * Update Toast
     */
    update: UpdateToast;
    /**
     * Clear all toasts
     */
    clear: ClearToasts;
    /**
     * Update Plugin Defaults
     */
    updateDefaults: UpdateDefaults;
}
export declare const buildInterface: (globalOptions?: PluginOptions, mountContainer?: boolean) => ToastInterface;
export {};
