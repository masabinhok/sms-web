import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { TextPlugin } from 'gsap/TextPlugin';

// Register plugins
gsap.registerPlugin(ScrollTrigger, Flip, TextPlugin);

// Config for premium feel
gsap.defaults({
  ease: 'power3.out',
  duration: 0.6,
});

// Helper to check for reduced motion or if animation should be skipped
const shouldAnimate = () => {
  if (typeof window === 'undefined') return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const animateIn = (element: string | Element | null, vars: gsap.TweenVars = {}) => {
  if (!element || !shouldAnimate()) return;
  
  // Inject data-premium attribute
  if (element instanceof Element) {
    element.setAttribute('data-premium', 'true');
  } else if (typeof element === 'string') {
    document.querySelectorAll(element).forEach(el => el.setAttribute('data-premium', 'true'));
  }

  return gsap.fromTo(element, 
    { opacity: 0, y: 20, filter: 'blur(10px)', ...vars.from },
    { opacity: 1, y: 0, filter: 'blur(0px)', ...vars, duration: vars.duration || 0.8 }
  );
};

export const animateOut = (element: string | Element | null, vars: gsap.TweenVars = {}) => {
  if (!element || !shouldAnimate()) return;
  return gsap.to(element, { 
    opacity: 0, 
    y: -20, 
    filter: 'blur(10px)', 
    ...vars,
    duration: vars.duration || 0.5 
  });
};

export const staggerList = (elements: string | Element[] | NodeListOf<Element>, vars: gsap.TweenVars = {}) => {
  if (!shouldAnimate()) return;
  
  // Inject data-premium
  if (typeof elements === 'string') {
    document.querySelectorAll(elements).forEach(el => el.setAttribute('data-premium', 'list-item'));
  } else if (Array.isArray(elements) || elements instanceof NodeList) {
    elements.forEach((el: any) => el.setAttribute && el.setAttribute('data-premium', 'list-item'));
  }

  return gsap.fromTo(elements, 
    { opacity: 0, x: -10, filter: 'blur(5px)' },
    { 
      opacity: 1, 
      x: 0, 
      filter: 'blur(0px)', 
      stagger: 0.05, 
      ease: 'power2.out',
      ...vars 
    }
  );
};

// Simulating a morph using Flip or Scale/Fade if Flip state isn't provided
export const morphModal = (fromElement: Element, toElement: Element, onComplete?: () => void) => {
  if (!shouldAnimate()) {
    if (onComplete) onComplete();
    return;
  }

  const state = Flip.getState(fromElement);
  
  // This assumes the toElement is already in the DOM but maybe hidden or positioned differently
  // In a real React scenario, we often toggle state. 
  // This helper might need to be used inside a useEffect where state changes happen.
  
  // For now, we'll provide a generic "expand" animation function that can be called
  // when a modal opens, originating from a trigger.
  
  // If we can't use Flip easily without state changes, we'll do a scale expansion
  const fromRect = fromElement.getBoundingClientRect();
  const toRect = toElement.getBoundingClientRect();
  
  gsap.set(toElement, { 
    transformOrigin: 'top left',
    x: fromRect.left - toRect.left,
    y: fromRect.top - toRect.top,
    width: fromRect.width,
    height: fromRect.height,
    opacity: 0,
    borderRadius: getComputedStyle(fromElement).borderRadius
  });

  return gsap.to(toElement, {
    x: 0,
    y: 0,
    width: toRect.width,
    height: toRect.height,
    opacity: 1,
    borderRadius: getComputedStyle(toElement).borderRadius,
    ease: 'expo.inOut',
    duration: 0.8,
    onComplete
  });
};

export const revealOnScroll = (element: string | Element, vars: gsap.TweenVars = {}) => {
  if (!shouldAnimate()) return;
  
  if (element instanceof Element) element.setAttribute('data-premium', 'scroll-reveal');

  return gsap.fromTo(element, 
    { opacity: 0, y: 50, filter: 'blur(10px)' },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
        ...vars.scrollTrigger as any
      },
      ...vars
    }
  );
};

export default gsap;
