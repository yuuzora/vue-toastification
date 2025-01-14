import type { ToastID } from "../types/common";
import type { ToastOptionsAndContent, ToastContent, ToastOptions } from "../types/toast";
import type { ToastContainerOptions } from "../types/toastContainer";
import type { EVENTS } from "./constants";
type EventData = {
    [EVENTS.ADD]: ToastOptionsAndContent & {
        id: ToastID;
    };
    [EVENTS.CLEAR]: undefined;
    [EVENTS.DISMISS]: ToastID;
    [EVENTS.UPDATE]: {
        id: ToastID;
        options: Partial<ToastOptions> & {
            content?: ToastContent;
        };
        create: false;
    } | {
        id: ToastID;
        options: Partial<ToastOptions> & {
            content: ToastContent;
        };
        create: true;
    };
    [EVENTS.UPDATE_DEFAULTS]: ToastContainerOptions;
};
type Handler<E extends EVENTS> = (event: EventData[E]) => void;
export interface EventBusInterface {
    on<E extends EVENTS>(eventType: E, handler: Handler<E>): void;
    off<E extends EVENTS>(eventType: E, handler: Handler<E>): void;
    emit<E extends EVENTS>(eventType: E, event: EventData[E]): void;
}
type HandlerList<E extends EVENTS> = Handler<E>[];
type HandlerMap = {
    [E in EVENTS]?: HandlerList<E>;
};
export declare class EventBus implements EventBusInterface {
    protected allHandlers: HandlerMap;
    protected getHandlers<E extends EVENTS>(eventType: E): HandlerList<E>;
    on<E extends EVENTS>(eventType: E, handler: Handler<E>): void;
    off<E extends EVENTS>(eventType: E, handler: Handler<E>): void;
    emit<E extends EVENTS>(eventType: E, event: EventData[E]): void;
}
export declare const isEventBusInterface: (e: unknown) => e is EventBusInterface;
export declare const globalEventBus: EventBus;
export {};
