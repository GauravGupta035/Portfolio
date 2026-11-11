import { useEffect, useRef } from 'react';
import type { ProjectPreview } from '../../content';
import { reducedMotionQuery } from '../../motion';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

/** The project's pre-rendered loop: muted and inline, playing only while it is on screen and the
 * visitor allows motion. Until then, and always with reduced motion, it shows its poster. */
export function PreviewVideo({
  preview,
  label,
  className,
}: {
  preview: ProjectPreview;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    // Without these there is no way to tell what is on screen or honour reduced motion, so the
    // poster stays.
    if (!video || !window.matchMedia || !window.IntersectionObserver) return;
    const reduced = window.matchMedia(reducedMotionQuery);
    let visible = false;
    const update = () => {
      if (visible && !reduced.matches) {
        // A refused play (autoplay policy, missing codec) leaves the poster, which is fine.
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(video);
    reduced.addEventListener('change', update);
    return () => {
      observer.disconnect();
      reduced.removeEventListener('change', update);
      video.pause();
    };
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={asset(preview.video)}
      poster={asset(preview.poster)}
      aria-label={label}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      width={480}
      height={270}
    />
  );
}
