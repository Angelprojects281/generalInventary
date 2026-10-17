declare module "vanta/dist/vanta.net.min" {
  interface VantaEffect {
    destroy: () => void;
  }

  interface VantaOptions {
    el: HTMLElement;
    THREE: unknown;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: number;
    backgroundColor?: number;
    backgroundAlpha?: number;
    points?: number;
    maxDistance?: number;
    spacing?: number;
  }

  export default function NET(options: VantaOptions): VantaEffect;
}
