import { useId, type ReactNode } from 'react';
import styles from './OrganicShape.module.css';
import { organicShapes, type OrganicShapeName } from './shapes';

type OrganicShapeProps = {
  shape: OrganicShapeName;
  /** `fill` paints the shape, `stroke` draws its outline only. */
  variant?: 'fill' | 'stroke';
  className?: string;
};

/** Decorative blob from Primitive / Organic Shape. Colour comes from `currentColor`. */
export function OrganicShape({ shape, variant = 'fill', className }: OrganicShapeProps) {
  const { width, height, path } = organicShapes[shape];
  return (
    <svg
      className={className ? `${styles.shape} ${className}` : styles.shape}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} className={styles[variant]} />
    </svg>
  );
}

type OrganicMaskProps = {
  shape: OrganicShapeName;
  className?: string;
  children: ReactNode;
};

/** Clips its children to an organic shape and draws the shape's outline on top. */
export function OrganicMask({ shape, className, children }: OrganicMaskProps) {
  // useId output can contain characters that are not valid in a url() reference.
  const id = `organic-${useId().replace(/[^\w-]/g, '')}`;
  const { width, height, path } = organicShapes[shape];
  return (
    <div className={className ? `${styles.mask} ${className}` : styles.mask}>
      <svg className={styles.defs} aria-hidden="true" focusable="false">
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          <path d={path} transform={`scale(${1 / width} ${1 / height})`} />
        </clipPath>
      </svg>
      <div className={styles.content} style={{ clipPath: `url(#${id})` }}>
        {children}
      </div>
      <OrganicShape shape={shape} variant="stroke" className={styles.outline} />
    </div>
  );
}
