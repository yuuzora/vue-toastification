import { Ref } from "vue";
import type { Hoverable } from "../../types/common";
export declare const useHoverable: (el: Ref<HTMLElement | undefined>, props: Required<Hoverable>) => {
    hovering: Ref<boolean>;
};
