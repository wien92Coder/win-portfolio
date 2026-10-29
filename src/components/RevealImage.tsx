import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** Adds a scroll-driven vertical parallax to the image inside its frame. */
  parallax?: boolean;
  /** Parallax travel in px (image is over-scaled to hide the gaps). */
  parallaxAmount?: number;
  /** Zoom the image inside its frame while the nearest `.group` is hovered. */
  hoverZoom?: boolean;
  priority?: boolean;
  /** CSS object-position for the crop. Defaults to the frame's top edge. */
  objectPosition?: string;
};

/**
 * Image inside a clip frame. On scroll-in a paper panel wipes up and the image
 * settles from an over-scaled state. Optional parallax and hover zoom.
 */
export function RevealImage({
  src,
  alt,
  className = '',
  parallax = false,
  parallaxAmount = 80,
  hoverZoom = false,
  priority = false,
  objectPosition,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    parallax ? [-parallaxAmount, parallaxAmount] : [0, 0],
  );

  return (
    <div ref={ref} className={`relative overflow-hidden bg-ink/5 ${className}`}>
      {/* The hover zoom lives on this wrapper, not the image: framer owns the
          image's transform for the reveal and the parallax, and a CSS scale on
          the same element would fight it. Zooming inside the frame keeps the
          grid's edges still. */}
      <div
        className={`absolute inset-0 transition-transform duration-[900ms] ease-expo ${
          hoverZoom ? 'group-hover:scale-[1.04]' : ''
        }`}
      >
        {/* Over-scaled so parallax never exposes an edge. */}
        <motion.img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          style={{ y, objectPosition }}
          className="img-editorial absolute -top-[10%] inset-0 h-[120%] w-full object-cover object-top will-change-transform"
          initial={{ scale: 1.35 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: '-5% 0px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      {/* Wipe mask: a paper panel that slides up to uncover the frame. */}
      <motion.div
        className="absolute inset-0 z-10 bg-paper"
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={{ once: true, margin: '-5% 0px' }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        style={{ originY: 0 }}
      />
    </div>
  );
}
