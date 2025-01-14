import { Ref } from "vue";
import type { Draggable } from "../../types/common";
export declare const useDraggable: (el: Ref<HTMLElement | undefined>, props: Required<Draggable>) => {
    dragComplete: Ref<boolean>;
    beingDragged: Ref<boolean>;
};
