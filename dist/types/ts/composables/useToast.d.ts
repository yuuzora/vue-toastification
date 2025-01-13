import { InjectionKey } from "vue";
import { EventBusInterface, EventBus } from "../eventBus";
import type { PluginOptions } from "../../types/plugin";
import type { ToastInterface } from "../interface";
declare const toastInjectionKey: InjectionKey<ToastInterface>;
/**
 * Creates (or recovers) a toast instance and returns
 * an interface to it
 */
interface CreateToastInstance {
    /**
     * Creates an interface to an existing instance from its interface
     */
    (eventBus: EventBusInterface): ToastInterface;
    /**
     * Creats a new instance of Vue Toastification
     */
    (options?: PluginOptions): ToastInterface;
}
declare const createToastInstance: CreateToastInstance;
declare const provideToast: (options?: PluginOptions | undefined) => void;
declare const useToast: (eventBus?: EventBus | undefined) => ToastInterface;
export { useToast, provideToast, toastInjectionKey, createToastInstance };
