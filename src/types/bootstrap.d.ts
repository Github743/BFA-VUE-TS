declare module "bootstrap" {

  interface BootstrapOptions {
    [key: string]: any;
  }

  interface BootstrapInstance {
    show?: () => void;
    hide?: () => void;
    toggle?: () => void;
    dispose?: () => void;
  }

  export interface ModalOptions extends BootstrapOptions {
    backdrop?: boolean | "static";
    keyboard?: boolean;
    focus?: boolean;
  }

  export class Modal implements BootstrapInstance {
    constructor(element: Element | string, options?: ModalOptions);
    show(): void;
    hide(): void;
    toggle(): void;
    handleUpdate?(): void;
    dispose(): void;

    // static helpers
    static getInstance(element: Element): Modal | null;
    static getOrCreateInstance(element: Element, options?: ModalOptions): Modal;
  }

  export interface TooltipOptions extends BootstrapOptions {
    animation?: boolean;
    container?: Element | string | null;
    delay?: number | { show: number; hide: number };
    html?: boolean;
    placement?: string | ((context: { placement: string }) => string);
    selector?: string | false;
    title?: string | Element | ((element: Element) => string | Element);
    trigger?: string;
    offset?: string | number | ((offsets: any) => any);
    boundary?: string | Element;
    fallbackPlacements?: string[];
    sanitize?: boolean;
    sanitizeFn?: (input: string) => string;
  }

  export class Tooltip implements BootstrapInstance {
    constructor(element: Element | string, options?: TooltipOptions);
    show(): void;
    hide(): void;
    toggle(): void;
    enable(): void;
    disable(): void;
    dispose(): void;
    update(): void;

    static getInstance(element: Element): Tooltip | null;
    static getOrCreateInstance(element: Element, options?: TooltipOptions): Tooltip;
  }

  export interface PopoverOptions extends TooltipOptions {
    content?: string | Element | (() => string | Element);
  }

  export class Popover extends Tooltip {
    constructor(element: Element | string, options?: PopoverOptions);
    static getInstance(element: Element): Popover | null;
    static getOrCreateInstance(element: Element, options?: PopoverOptions): Popover;
  }

  export interface DropdownOptions extends BootstrapOptions {
    offset?: number | string | ((popperData: any) => number | string);
    flip?: boolean;
    boundary?: Element | string;
    reference?: Element | string | ((context: any) => Element);
  }

  export class Dropdown implements BootstrapInstance {
    constructor(element: Element | string, options?: DropdownOptions);
    toggle(): void;
    show(): void;
    hide(): void;
    dispose(): void;

    static getInstance(element: Element): Dropdown | null;
    static getOrCreateInstance(element: Element, options?: DropdownOptions): Dropdown;
  }

  export interface CollapseOptions extends BootstrapOptions {
    toggle?: boolean;
  }

  export class Collapse implements BootstrapInstance {
    constructor(element: Element | string, options?: CollapseOptions);
    show(): void;
    hide(): void;
    toggle(): void;
    dispose(): void;

    static getInstance(element: Element): Collapse | null;
    static getOrCreateInstance(element: Element, options?: CollapseOptions): Collapse;
  }

  export interface OffcanvasOptions extends BootstrapOptions {
    backdrop?: boolean;
    keyboard?: boolean;
    scroll?: boolean;
  }

  export class Offcanvas implements BootstrapInstance {
    constructor(element: Element | string, options?: OffcanvasOptions);
    show(): void;
    hide(): void;
    toggle(): void;
    dispose(): void;

    static getInstance(element: Element): Offcanvas | null;
    static getOrCreateInstance(element: Element, options?: OffcanvasOptions): Offcanvas;
  }

  export interface ToastOptions extends BootstrapOptions {
    animation?: boolean;
    autohide?: boolean;
    delay?: number;
  }

  export class Toast implements BootstrapInstance {
    constructor(element: Element | string, options?: ToastOptions);
    show(): void;
    hide(): void;
    dispose(): void;

    static getInstance(element: Element): Toast | null;
    static getOrCreateInstance(element: Element, options?: ToastOptions): Toast;
  }

  export interface AlertOptions extends BootstrapOptions {}

  export class Alert implements BootstrapInstance {
    constructor(element: Element | string, options?: AlertOptions);
    close(): void;
    dispose(): void;

    static getInstance(element: Element): Alert | null;
    static getOrCreateInstance(element: Element, options?: AlertOptions): Alert;
  }

  export interface ScrollSpyOptions extends BootstrapOptions {
    offset?: number;
    method?: "auto" | "offset" | "position";
    target?: string | Element;
  }

  export class ScrollSpy implements BootstrapInstance {
    constructor(element: Element | string, options?: ScrollSpyOptions);
    refresh(): void;
    dispose(): void;

    static getInstance(element: Element): ScrollSpy | null;
    static getOrCreateInstance(element: Element, options?: ScrollSpyOptions): ScrollSpy;
  }

  export function getInstance(element: Element, component: any): any;
  export function getOrCreateInstance(element: Element, component: any, options?: any): any;
}
