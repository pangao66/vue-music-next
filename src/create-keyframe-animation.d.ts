declare module 'create-keyframe-animation' {
  export function registerAnimation (animation: any): void;

  export function runAnimation (dom: HTMLElement, type: string, done: HTMLElementEventMap): void;

  export function unregisterAnimation (type: string): void;
}
