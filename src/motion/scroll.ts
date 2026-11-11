import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Starts Lenis on the window and drives it from the GSAP ticker, so ScrollTrigger reads the
 * same scroll position Lenis paints. Returns a function that stops it again. */
export function startSmoothScroll() {
  const lenis = new Lenis();
  const tick = (time: number) => lenis.raf(time * 1000);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    gsap.ticker.lagSmoothing(500, 33);
    lenis.destroy();
  };
}
