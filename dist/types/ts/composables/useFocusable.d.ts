import { Ref } from "vue";
import type { Focusable } from "../../types/common";
export declare const useFocusable: (el: Ref<HTMLElement | undefined>, props: Required<Focusable>) => {
    focused: Ref<boolean>;
};
