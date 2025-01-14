var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { defineComponent, toRaw, unref, toRefs, computed, ref, watch, onMounted, onBeforeUnmount, openBlock, createBlock, resolveDynamicComponent, mergeProps, withCtx, createTextVNode, createElementBlock, createElementVNode, normalizeClass, toDisplayString, nextTick, normalizeStyle, createCommentVNode, Fragment, toHandlers, withModifiers, TransitionGroup, renderSlot, reactive, onBeforeMount, renderList, createVNode, createApp, getCurrentInstance, provide, inject } from "vue";
var index = "";
var TYPE = /* @__PURE__ */ ((TYPE2) => {
  TYPE2["SUCCESS"] = "success";
  TYPE2["ERROR"] = "error";
  TYPE2["WARNING"] = "warning";
  TYPE2["INFO"] = "info";
  TYPE2["DEFAULT"] = "default";
  return TYPE2;
})(TYPE || {});
var POSITION = /* @__PURE__ */ ((POSITION2) => {
  POSITION2["TOP_LEFT"] = "top-left";
  POSITION2["TOP_CENTER"] = "top-center";
  POSITION2["TOP_RIGHT"] = "top-right";
  POSITION2["BOTTOM_LEFT"] = "bottom-left";
  POSITION2["BOTTOM_CENTER"] = "bottom-center";
  POSITION2["BOTTOM_RIGHT"] = "bottom-right";
  return POSITION2;
})(POSITION || {});
var EVENTS = /* @__PURE__ */ ((EVENTS2) => {
  EVENTS2["ADD"] = "add";
  EVENTS2["DISMISS"] = "dismiss";
  EVENTS2["UPDATE"] = "update";
  EVENTS2["CLEAR"] = "clear";
  EVENTS2["UPDATE_DEFAULTS"] = "update_defaults";
  return EVENTS2;
})(EVENTS || {});
const VT_NAMESPACE = "Vue-Toastification";
const isFunction = (value) => typeof value === "function";
const isString = (value) => typeof value === "string";
const isNonEmptyString = (value) => isString(value) && value.trim().length > 0;
const isNumber = (value) => typeof value === "number";
const isUndefined = (value) => typeof value === "undefined";
const isObject = (value) => typeof value === "object" && value !== null;
const isJSX = (obj) => hasProp(obj, "tag") && isNonEmptyString(obj.tag);
const isTouchEvent = (event) => window.TouchEvent && event instanceof TouchEvent;
const isToastComponent = (obj) => hasProp(obj, "component") && isToastContent(obj.component);
const isVueComponent = (c) => isFunction(c) || isObject(c);
const isToastContent = (obj) => !isUndefined(obj) && (isString(obj) || isVueComponent(obj) || isToastComponent(obj));
const isDOMRect = (obj) => isObject(obj) && ["height", "width", "right", "left", "top", "bottom"].every(
  (p) => isNumber(obj[p])
);
const hasProp = (obj, propKey) => (isObject(obj) || isFunction(obj)) && propKey in obj;
const getProp = (obj, propKey, fallback) => hasProp(obj, propKey) ? obj[propKey] : fallback;
const getId = ((i) => () => i++)(0);
function getX(event) {
  return isTouchEvent(event) ? event.targetTouches[0].clientX : event.clientX;
}
function getY(event) {
  return isTouchEvent(event) ? event.targetTouches[0].clientY : event.clientY;
}
const removeElement = (el) => {
  if (!isUndefined(el.remove)) {
    el.remove();
  } else if (el.parentNode) {
    el.parentNode.removeChild(el);
  }
};
const getVueComponentFromObj = (obj) => {
  if (isToastComponent(obj)) {
    return getVueComponentFromObj(obj.component);
  }
  if (isJSX(obj)) {
    return defineComponent({
      render() {
        return obj;
      }
    });
  }
  return typeof obj === "string" ? obj : toRaw(unref(obj));
};
const normalizeToastComponent = (obj) => {
  if (typeof obj === "string") {
    return obj;
  }
  const props = hasProp(obj, "props") && isObject(obj.props) ? obj.props : {};
  const listeners = hasProp(obj, "listeners") && isObject(obj.listeners) ? obj.listeners : {};
  return { component: getVueComponentFromObj(obj), props, listeners };
};
const isBrowser = () => typeof window !== "undefined";
const asContainerProps = (options) => {
  const {
    position,
    container,
    newestOnTop,
    maxToasts,
    transition,
    toastDefaults,
    eventBus,
    filterBeforeCreate,
    filterToasts,
    containerClassName,
    ...defaultToastProps
  } = options;
  const containerProps = {
    position,
    container,
    newestOnTop,
    maxToasts,
    transition,
    toastDefaults,
    eventBus,
    filterBeforeCreate,
    filterToasts,
    containerClassName,
    defaultToastProps
  };
  const keys = Object.keys(containerProps);
  keys.forEach(
    (key) => typeof containerProps[key] === "undefined" && delete containerProps[key]
  );
  return containerProps;
};
class EventBus {
  constructor() {
    __publicField(this, "allHandlers", {});
  }
  getHandlers(eventType) {
    return this.allHandlers[eventType] || [];
  }
  on(eventType, handler) {
    const handlers = this.getHandlers(eventType);
    handlers.push(handler);
    this.allHandlers[eventType] = handlers;
  }
  off(eventType, handler) {
    const handlers = this.getHandlers(eventType);
    handlers.splice(handlers.indexOf(handler) >>> 0, 1);
  }
  emit(eventType, event) {
    const handlers = this.getHandlers(eventType);
    handlers.forEach((handler) => handler(event));
  }
}
const isEventBusInterface = (e) => ["on", "off", "emit"].every((f) => hasProp(e, f) && isFunction(e[f]));
const globalEventBus = new EventBus();
const defaultEventBus = () => new EventBus();
const emptyFunction = () => {
};
const asFactory = (f) => () => f;
const TOAST_DEFAULTS = {
  id: 0,
  accessibility: () => ({
    toastRole: "alert",
    closeButtonLabel: "close"
  }),
  bodyClassName: () => [],
  closeButton: () => "button",
  closeButtonClassName: () => [],
  closeOnClick: true,
  draggable: true,
  draggablePercent: 0.6,
  eventBus: defaultEventBus,
  hideProgressBar: false,
  icon: () => true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  position: POSITION.TOP_RIGHT,
  rtl: false,
  showCloseButtonOnHover: false,
  timeout: 5e3,
  toastClassName: () => [],
  onClick: emptyFunction,
  onClose: emptyFunction,
  type: TYPE.DEFAULT
};
const TOAST_CONTAINER_DEFAULTS = {
  position: TOAST_DEFAULTS.position,
  container: () => document.body,
  containerClassName: () => [],
  eventBus: defaultEventBus,
  filterBeforeCreate: asFactory((toast) => toast),
  filterToasts: asFactory((toasts) => toasts),
  maxToasts: 20,
  newestOnTop: true,
  toastDefaults: () => ({}),
  transition: `${VT_NAMESPACE}__bounce`,
  defaultToastProps: () => ({})
};
const useDraggable = (el, props) => {
  const { draggablePercent, draggable } = toRefs(props);
  const dragRect = computed(
    () => el.value ? el.value.getBoundingClientRect() : void 0
  );
  const dragStarted = ref(false);
  const beingDragged = ref(false);
  const dragPos = ref({ x: 0, y: 0 });
  const dragStart = ref(0);
  const dragDelta = computed(
    () => beingDragged.value ? dragPos.value.x - dragStart.value : 0
  );
  const dragComplete = ref(false);
  const removalDistance = computed(
    () => isDOMRect(dragRect.value) ? (dragRect.value.right - dragRect.value.left) * draggablePercent.value : 0
  );
  watch(
    [el, dragStart, dragPos, dragDelta, removalDistance, beingDragged],
    () => {
      if (el.value) {
        el.value.style.transform = "translateX(0px)";
        el.value.style.opacity = "1";
        if (dragStart.value === dragPos.value.x) {
          el.value.style.transition = "";
        } else if (beingDragged.value) {
          el.value.style.transform = `translateX(${dragDelta.value}px)`;
          el.value.style.opacity = `${1 - Math.abs(dragDelta.value / removalDistance.value)}`;
        } else {
          el.value.style.transition = "transform 0.2s, opacity 0.2s";
        }
      }
    }
  );
  const onDragStart = (event) => {
    dragStarted.value = true;
    dragPos.value = { x: getX(event), y: getY(event) };
    dragStart.value = dragPos.value.x;
  };
  const onDragMove = (event) => {
    if (dragStarted.value) {
      beingDragged.value = true;
      event.preventDefault();
      dragPos.value = { x: getX(event), y: getY(event) };
    }
  };
  const onDragEnd = () => {
    dragStarted.value = false;
    if (beingDragged.value) {
      if (Math.abs(dragDelta.value) >= removalDistance.value) {
        dragComplete.value = true;
      } else {
        setTimeout(() => {
          beingDragged.value = false;
        });
      }
    }
  };
  onMounted(() => {
    if (draggable.value && el.value) {
      el.value.addEventListener("touchstart", onDragStart, {
        passive: true
      });
      el.value.addEventListener("mousedown", onDragStart);
      addEventListener("touchmove", onDragMove, { passive: false });
      addEventListener("mousemove", onDragMove);
      addEventListener("touchend", onDragEnd);
      addEventListener("mouseup", onDragEnd);
    }
  });
  onBeforeUnmount(() => {
    if (draggable.value && el.value) {
      el.value.removeEventListener("touchstart", onDragStart);
      el.value.removeEventListener("mousedown", onDragStart);
      removeEventListener("touchmove", onDragMove);
      removeEventListener("mousemove", onDragMove);
      removeEventListener("touchend", onDragEnd);
      removeEventListener("mouseup", onDragEnd);
    }
  });
  return { dragComplete, beingDragged };
};
const useFocusable = (el, props) => {
  const { pauseOnFocusLoss } = toRefs(props);
  const focused = ref(true);
  const onFocus = () => focused.value = true;
  const onBlur = () => focused.value = false;
  onMounted(() => {
    if (el.value && pauseOnFocusLoss.value) {
      addEventListener("blur", onBlur);
      addEventListener("focus", onFocus);
    }
  });
  onBeforeUnmount(() => {
    if (el.value && pauseOnFocusLoss.value) {
      removeEventListener("blur", onBlur);
      removeEventListener("focus", onFocus);
    }
  });
  return { focused };
};
const useHoverable = (el, props) => {
  const { pauseOnHover } = toRefs(props);
  const hovering = ref(false);
  const onEnter = () => hovering.value = true;
  const onLeave = () => hovering.value = false;
  onMounted(() => {
    if (el.value && pauseOnHover.value) {
      el.value.addEventListener("mouseenter", onEnter);
      el.value.addEventListener("mouseleave", onLeave);
    }
  });
  onBeforeUnmount(() => {
    if (el.value && pauseOnHover.value) {
      el.value.removeEventListener("mouseenter", onEnter);
      el.value.removeEventListener("mouseleave", onLeave);
    }
  });
  return { hovering };
};
const _hoisted_1$5 = /* @__PURE__ */ createTextVNode(" \xD7 ");
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  props: {
    component: { default: TOAST_DEFAULTS.closeButton },
    classNames: { default: TOAST_DEFAULTS.closeButtonClassName },
    showOnHover: { type: Boolean, default: TOAST_DEFAULTS.showCloseButtonOnHover },
    ariaLabel: { default: TOAST_DEFAULTS.accessibility()["closeButtonLabel"] }
  },
  setup(__props) {
    const props = __props;
    const buttonComponent = computed(() => {
      if (props.component !== false) {
        return getVueComponentFromObj(props.component);
      }
      return "button";
    });
    const classes = computed(() => {
      const classes2 = [`${VT_NAMESPACE}__close-button`];
      if (props.showOnHover) {
        classes2.push("show-on-hover");
      }
      return classes2.concat(props.classNames);
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(unref(buttonComponent)), mergeProps({
        "aria-label": __props.ariaLabel,
        class: unref(classes)
      }, _ctx.$attrs), {
        default: withCtx(() => [
          _hoisted_1$5
        ]),
        _: 1
      }, 16, ["aria-label", "class"]);
    };
  }
});
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$8 = {};
const _hoisted_1$4 = {
  "aria-hidden": "true",
  focusable: "false",
  role: "img",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 576 512"
};
const _hoisted_2$3 = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"
}, null, -1);
const _hoisted_3$3 = [
  _hoisted_2$3
];
function _sfc_render$3(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$4, _hoisted_3$3);
}
var ErrorIcon = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$3]]);
const _sfc_main$7 = {};
const _hoisted_1$3 = {
  "aria-hidden": "true",
  focusable: "false",
  role: "img",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
};
const _hoisted_2$2 = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"
}, null, -1);
const _hoisted_3$2 = [
  _hoisted_2$2
];
function _sfc_render$2(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$3, _hoisted_3$2);
}
var InfoIcon = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$2]]);
const _sfc_main$6 = {};
const _hoisted_1$2 = {
  "aria-hidden": "true",
  focusable: "false",
  role: "img",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
};
const _hoisted_2$1 = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
}, null, -1);
const _hoisted_3$1 = [
  _hoisted_2$1
];
function _sfc_render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$2, _hoisted_3$1);
}
var SuccessIcon = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$1]]);
const _sfc_main$5 = {};
const _hoisted_1$1 = {
  "aria-hidden": "true",
  focusable: "false",
  role: "img",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
};
const _hoisted_2 = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"
}, null, -1);
const _hoisted_3 = [
  _hoisted_2
];
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$1, _hoisted_3);
}
var WarningIcon = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render]]);
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  props: {
    type: { default: TYPE.DEFAULT },
    customIcon: { default: TOAST_DEFAULTS.icon }
  },
  setup(__props) {
    const props = __props;
    const trimValue = (value, empty = "") => {
      return isNonEmptyString(value) ? value.trim() : empty;
    };
    const customIconChildren = computed(() => {
      return hasProp(props.customIcon, "iconChildren") ? trimValue(props.customIcon.iconChildren) : "";
    });
    const customIconClass = computed(() => {
      if (isString(props.customIcon)) {
        return trimValue(props.customIcon);
      } else if (hasProp(props.customIcon, "iconClass")) {
        return trimValue(props.customIcon.iconClass);
      }
      return "";
    });
    const customIconTag = computed(() => {
      if (hasProp(props.customIcon, "iconTag")) {
        return trimValue(props.customIcon.iconTag, "i");
      }
      return "i";
    });
    const hasCustomIcon = computed(() => {
      return customIconClass.value.length > 0;
    });
    const component = computed(() => {
      if (hasCustomIcon.value) {
        return customIconTag.value;
      }
      if (isToastContent(props.customIcon)) {
        return getVueComponentFromObj(props.customIcon);
      }
      return iconTypeComponent.value;
    });
    const iconTypeComponent = computed(() => {
      const types = {
        [TYPE.DEFAULT]: InfoIcon,
        [TYPE.INFO]: InfoIcon,
        [TYPE.SUCCESS]: SuccessIcon,
        [TYPE.ERROR]: ErrorIcon,
        [TYPE.WARNING]: WarningIcon
      };
      return types[props.type];
    });
    const iconClasses = computed(() => {
      const classes = [`${VT_NAMESPACE}__icon`];
      if (hasCustomIcon.value) {
        return classes.concat(customIconClass.value);
      }
      return classes;
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(unref(component)), {
        class: normalizeClass(unref(iconClasses))
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(unref(customIconChildren)), 1)
        ]),
        _: 1
      }, 8, ["class"]);
    };
  }
});
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  props: {
    timeout: { default: TOAST_DEFAULTS.timeout },
    hideProgressBar: { default: TOAST_DEFAULTS.hideProgressBar },
    isRunning: { type: Boolean, default: false }
  },
  emits: ["close-toast"],
  setup(__props, { emit }) {
    const props = __props;
    const el = ref();
    const hasClass = ref(true);
    const style = computed(() => {
      return {
        animationDuration: `${props.timeout}ms`,
        animationPlayState: props.isRunning ? "running" : "paused",
        opacity: props.hideProgressBar ? 0 : 1
      };
    });
    const cpClass = computed(
      () => hasClass.value ? `${VT_NAMESPACE}__progress-bar` : ""
    );
    watch(
      () => props.timeout,
      () => {
        hasClass.value = false;
        nextTick(() => hasClass.value = true);
      }
    );
    const animationEnded = () => emit("close-toast");
    onMounted(() => {
      if (el.value) {
        el.value.addEventListener("animationend", animationEnded);
      }
    });
    onBeforeUnmount(() => {
      if (el.value) {
        el.value.removeEventListener("animationend", animationEnded);
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "el",
        ref: el,
        style: normalizeStyle(unref(style)),
        class: normalizeClass(unref(cpClass))
      }, null, 6);
    };
  }
});
const _hoisted_1 = ["role"];
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  props: {
    content: null,
    id: { default: 0 },
    accessibility: { default: TOAST_DEFAULTS.accessibility },
    bodyClassName: { default: TOAST_DEFAULTS.bodyClassName },
    closeButton: { default: TOAST_DEFAULTS.closeButton },
    closeButtonClassName: { default: TOAST_DEFAULTS.closeButtonClassName },
    closeOnClick: { default: TOAST_DEFAULTS.closeOnClick },
    draggable: { default: TOAST_DEFAULTS.draggable },
    draggablePercent: { default: TOAST_DEFAULTS.draggablePercent },
    eventBus: { default: TOAST_DEFAULTS.eventBus },
    hideProgressBar: { default: TOAST_DEFAULTS.hideProgressBar },
    icon: { default: TOAST_DEFAULTS.icon },
    onClick: { default: () => {
    } },
    onClose: { default: () => {
    } },
    pauseOnFocusLoss: { default: TOAST_DEFAULTS.pauseOnFocusLoss },
    pauseOnHover: { default: TOAST_DEFAULTS.pauseOnHover },
    position: { default: TOAST_DEFAULTS.position },
    rtl: { default: TOAST_DEFAULTS.rtl },
    showCloseButtonOnHover: { default: TOAST_DEFAULTS.showCloseButtonOnHover },
    timeout: { default: TOAST_DEFAULTS.timeout },
    toastClassName: { default: TOAST_DEFAULTS.toastClassName },
    type: { default: TYPE.DEFAULT }
  },
  setup(__props) {
    const props = __props;
    const el = ref();
    const { hovering } = useHoverable(el, props);
    const { focused } = useFocusable(el, props);
    const { beingDragged, dragComplete } = useDraggable(el, props);
    const isRunning = computed(
      () => !hovering.value && focused.value && !beingDragged.value
    );
    const closeToast = () => {
      props.eventBus.emit(EVENTS.DISMISS, props.id);
    };
    const clickHandler = () => {
      if (!beingDragged.value) {
        if (props.onClick) {
          props.onClick(closeToast);
        }
        if (props.closeOnClick) {
          closeToast();
        }
      }
    };
    watch(dragComplete, (v) => {
      if (v) {
        nextTick(() => closeToast());
      }
    });
    const classes = computed(() => {
      const classes2 = [
        `${VT_NAMESPACE}__toast`,
        `${VT_NAMESPACE}__toast--${props.type}`,
        `${props.position}`
      ].concat(props.toastClassName);
      if (dragComplete.value) {
        classes2.push("disable-transition");
      }
      if (props.rtl) {
        classes2.push(`${VT_NAMESPACE}__toast--rtl`);
      }
      return classes2;
    });
    const bodyClasses = computed(
      () => [
        `${VT_NAMESPACE}__toast-${isString(props.content) ? "body" : "component-body"}`
      ].concat(props.bodyClassName)
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "el",
        ref: el,
        class: normalizeClass(unref(classes)),
        onClick: clickHandler
      }, [
        __props.icon ? (openBlock(), createBlock(_sfc_main$4, {
          key: 0,
          "custom-icon": __props.icon,
          type: __props.type
        }, null, 8, ["custom-icon", "type"])) : createCommentVNode("", true),
        createElementVNode("div", {
          role: __props.accessibility.toastRole || "alert",
          class: normalizeClass(unref(bodyClasses))
        }, [
          typeof __props.content === "string" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            createTextVNode(toDisplayString(__props.content), 1)
          ], 64)) : (openBlock(), createBlock(resolveDynamicComponent(unref(getVueComponentFromObj)(__props.content)), mergeProps({
            key: 1,
            "toast-id": __props.id
          }, unref(getProp)(__props.content, "props", {}), toHandlers(unref(getProp)(__props.content, "listeners", {})), { onCloseToast: closeToast }), null, 16, ["toast-id"]))
        ], 10, _hoisted_1),
        !!__props.closeButton ? (openBlock(), createBlock(_sfc_main$9, {
          key: 1,
          component: __props.closeButton,
          "class-names": __props.closeButtonClassName,
          "show-on-hover": __props.showCloseButtonOnHover,
          "aria-label": __props.accessibility.closeButtonLabel,
          onClick: withModifiers(closeToast, ["stop"])
        }, null, 8, ["component", "class-names", "show-on-hover", "aria-label", "onClick"])) : createCommentVNode("", true),
        __props.timeout ? (openBlock(), createBlock(_sfc_main$3, {
          key: 2,
          "is-running": unref(isRunning),
          "hide-progress-bar": __props.hideProgressBar,
          timeout: __props.timeout,
          onCloseToast: closeToast
        }, null, 8, ["is-running", "hide-progress-bar", "timeout"])) : createCommentVNode("", true)
      ], 2);
    };
  }
});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  props: {
    transition: { default: TOAST_CONTAINER_DEFAULTS.transition }
  },
  emits: ["leave"],
  setup(__props) {
    const leave = (el) => {
      if (el instanceof HTMLElement) {
        el.style.left = el.offsetLeft + "px";
        el.style.top = el.offsetTop + "px";
        el.style.width = getComputedStyle(el).width;
        el.style.position = "absolute";
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(TransitionGroup, {
        type: "animation",
        tag: "div",
        "enter-active-class": unref(getProp)(__props.transition, "enter", `${__props.transition}-enter-active`),
        "move-class": unref(getProp)(__props.transition, "move", `${__props.transition}-move`),
        "leave-active-class": unref(getProp)(__props.transition, "leave", `${__props.transition}-leave-active`),
        onLeave: leave
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["enter-active-class", "move-class", "leave-active-class"]);
    };
  }
});
const __default__ = {
  devtools: {
    hide: true
  }
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...__default__,
  props: {
    position: { default: TOAST_CONTAINER_DEFAULTS.position },
    container: { default: TOAST_CONTAINER_DEFAULTS.container },
    containerClassName: { default: TOAST_CONTAINER_DEFAULTS.containerClassName },
    defaultToastProps: { default: () => ({}) },
    eventBus: { default: TOAST_CONTAINER_DEFAULTS.eventBus },
    filterBeforeCreate: { default: TOAST_CONTAINER_DEFAULTS.filterBeforeCreate },
    filterToasts: { default: TOAST_CONTAINER_DEFAULTS.filterToasts },
    maxToasts: { default: TOAST_CONTAINER_DEFAULTS.maxToasts },
    newestOnTop: { default: TOAST_CONTAINER_DEFAULTS.newestOnTop },
    toastDefaults: { default: TOAST_CONTAINER_DEFAULTS.toastDefaults },
    transition: { default: TOAST_CONTAINER_DEFAULTS.transition }
  },
  setup(__props) {
    const props = __props;
    const positions = Object.values(POSITION);
    const asPositionRecord = (getValues) => positions.reduce(
      (agg, position) => ({
        ...agg,
        [position]: getValues(position)
      }),
      {}
    );
    const el = ref();
    const overrideContainerProps = reactive({});
    const containerProps = computed(() => ({
      ...props,
      ...overrideContainerProps
    }));
    const defaultToastProps = computed(() => ({
      eventBus: containerProps.value.eventBus,
      position: containerProps.value.position,
      ...containerProps.value.defaultToastProps
    }));
    const defaultToastTypeProps = computed(() => containerProps.value.toastDefaults);
    const toasts = reactive({});
    const toastArray = computed(() => Object.values(toasts));
    const filteredToasts = computed(() => {
      const filter = containerProps.value.filterToasts;
      return filter(toastArray.value);
    });
    const setup = async (container) => {
      if (isFunction(container)) {
        container = await container();
      }
      if (el.value) {
        removeElement(el.value);
        container.appendChild(el.value);
      }
    };
    const setToast = (props2) => {
      if (!isUndefined(props2.id)) {
        toasts[props2.id] = props2;
      }
    };
    const addToast = (toastProps) => {
      toastProps.content = normalizeToastComponent(toastProps.content);
      const typeProps = toastProps.type && defaultToastTypeProps.value[toastProps.type] || {};
      let toast = {
        ...defaultToastProps.value,
        ...typeProps,
        ...toastProps
      };
      const filterBeforeCreate = containerProps.value.filterBeforeCreate;
      toast = filterBeforeCreate(toast, toastArray.value);
      toast && setToast(toast);
    };
    const dismissToast = (id) => {
      const toast = toasts[id];
      if (toast && toast.onClose) {
        toast.onClose();
      }
      delete toasts[id];
    };
    const clearToasts = () => {
      Object.keys(toasts).forEach(dismissToast);
    };
    const positionToasts = computed(() => {
      const getPositionToasts = (position) => {
        const toasts2 = filteredToasts.value.filter((toast) => toast.position === position).slice(0, containerProps.value.maxToasts);
        return containerProps.value.newestOnTop ? toasts2.reverse() : toasts2;
      };
      return asPositionRecord(getPositionToasts);
    });
    const updateDefaults = (update) => {
      if (update.container) {
        setup(update.container);
      }
      Object.assign(overrideContainerProps, update);
    };
    const updateToast = (params) => {
      const { id, create, options } = params;
      if (toasts[id]) {
        if (options.timeout && options.timeout === toasts[id].timeout) {
          options.timeout++;
        }
        setToast({ ...toasts[id], ...options });
      } else if (create) {
        addToast({ id, ...options });
      }
    };
    const toastClasses = computed(() => {
      const getClasses = (position) => {
        const classes = [`${VT_NAMESPACE}__container`, position];
        return classes.concat(
          containerProps.value.containerClassName
        );
      };
      return asPositionRecord(getClasses);
    });
    onBeforeMount(() => {
      props.eventBus.on(EVENTS.ADD, addToast);
      props.eventBus.on(EVENTS.CLEAR, clearToasts);
      props.eventBus.on(EVENTS.DISMISS, dismissToast);
      props.eventBus.on(EVENTS.UPDATE, updateToast);
      props.eventBus.on(EVENTS.UPDATE_DEFAULTS, updateDefaults);
    });
    onMounted(() => {
      const container = containerProps.value.container;
      if (container) {
        setup(container);
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "el",
        ref: el
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(positions), (pos) => {
          return openBlock(), createElementBlock("div", { key: pos }, [
            createVNode(_sfc_main$1, {
              transition: unref(containerProps).transition,
              class: normalizeClass(unref(toastClasses)[pos])
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(positionToasts)[pos], (toast) => {
                  return openBlock(), createBlock(_sfc_main$2, mergeProps({
                    key: toast.id
                  }, toast), null, 16);
                }), 128))
              ]),
              _: 2
            }, 1032, ["transition", "class"])
          ]);
        }), 128))
      ], 512);
    };
  }
});
function mountPlugin(options) {
  const { shareAppContext, onMounted: onMounted2, ...basePluginOptions } = options;
  const containerProps = asContainerProps(basePluginOptions);
  const app = createApp(_sfc_main, {
    ...containerProps
  });
  if (shareAppContext && shareAppContext !== true) {
    const userApp = shareAppContext;
    app._context.components = userApp._context.components;
    app._context.directives = userApp._context.directives;
    app._context.mixins = userApp._context.mixins;
    app._context.provides = userApp._context.provides;
    app.config.globalProperties = userApp.config.globalProperties;
  }
  const component = app.mount(document.createElement("div"));
  if (!isUndefined(onMounted2)) {
    onMounted2(component, app);
  }
}
const createInterface = (events) => {
  const createToastMethod = (type) => {
    const method = (content, options) => {
      const props = Object.assign({ id: getId(), type, content }, options);
      events.emit(EVENTS.ADD, props);
      return props.id;
    };
    return method;
  };
  const dismiss = (toastID) => events.emit(EVENTS.DISMISS, toastID);
  const clear = () => events.emit(EVENTS.CLEAR, void 0);
  const updateDefaults = (update2) => events.emit(EVENTS.UPDATE_DEFAULTS, asContainerProps(update2));
  const update = (toastID, update2, create) => {
    const { content, options } = update2;
    events.emit(EVENTS.UPDATE, {
      id: toastID,
      create: create || false,
      options: { ...options, content }
    });
  };
  return Object.assign(createToastMethod(TYPE.DEFAULT), {
    success: createToastMethod(TYPE.SUCCESS),
    info: createToastMethod(TYPE.INFO),
    warning: createToastMethod(TYPE.WARNING),
    error: createToastMethod(TYPE.ERROR),
    dismiss,
    clear,
    update,
    updateDefaults
  });
};
const buildInterface = (globalOptions = {}, mountContainer = true) => {
  const options = { ...globalOptions };
  const events = options.eventBus = options.eventBus || new EventBus();
  if (mountContainer) {
    nextTick(() => mountPlugin(options));
  }
  return createInterface(events);
};
const toastInjectionKey = Symbol("VueToastification");
const createMockToastInstance = () => {
  const toast = () => console.warn(`[${VT_NAMESPACE}] This plugin does not support SSR!`);
  return new Proxy(toast, {
    get() {
      return toast;
    }
  });
};
const createToastInstance = (optionsOrEventBus) => {
  if (!isBrowser()) {
    return createMockToastInstance();
  }
  if (isEventBusInterface(optionsOrEventBus)) {
    return buildInterface({ eventBus: optionsOrEventBus }, false);
  }
  return buildInterface(optionsOrEventBus, true);
};
const provideToast = (options) => {
  if (getCurrentInstance()) {
    const toast = createToastInstance(options);
    provide(toastInjectionKey, toast);
  }
};
const useToast = (eventBus) => {
  if (eventBus) {
    return createToastInstance(eventBus);
  }
  const toast = getCurrentInstance() ? inject(toastInjectionKey, void 0) : void 0;
  return toast ? toast : createToastInstance(globalEventBus);
};
const VueToastificationPlugin = (App, options) => {
  if ((options == null ? void 0 : options.shareAppContext) === true) {
    options.shareAppContext = App;
  }
  const inter = createToastInstance({
    eventBus: globalEventBus,
    ...options
  });
  App.provide(toastInjectionKey, inter);
};
export { EventBus, POSITION, TYPE, createToastInstance, VueToastificationPlugin as default, provideToast, useToast };
