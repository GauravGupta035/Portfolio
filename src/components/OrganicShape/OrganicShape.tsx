import { useId, type ComponentPropsWithoutRef } from 'react';
import styles from './OrganicShape.module.css';
import { organicShapes, type OrganicShapeName } from './shapes';

type OrganicShapeProps = {
  shape: OrganicShapeName;
  /** `fill` paints the shape, `stroke` draws its outline only. */
  variant?: 'fill' | 'stroke';
  /** Replaces the shape's outline, for example mid-morph. Uses the shape's viewBox. */
  path?: string;
  className?: string;
};

/** Decorative blob from Primitive / Organic Shape. Colour comes from `currentColor`. */
export function OrganicShape({ shape, variant = 'fill', path, className }: OrganicShapeProps) {
  const { width, height } = organicShapes[shape];
  return (
    <svg
      className={className ? `${styles.shape} ${className}` : styles.shape}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path ?? organicShapes[shape].path} className={styles[variant]} />
    </svg>
  );
}

type OrganicMaskProps = ComponentPropsWithoutRef<'div'> & {
  shape: OrganicShapeName;
  /** Replaces the shape's outline for both the clip and the stroke. */
  path?: string;
};

/** Clips its children to an organic shape and draws the shape's outline on top. */
export function OrganicMask({ shape, path, className, children, ...props }: OrganicMaskProps) {
  // useId output can contain characters that are not valid in a url() reference.
  const id = `organic-${useId().replace(/[^\w-]/g, '')}`;
  const { width, height } = organicShapes[shape];
  const outline = path ?? organicShapes[shape].path;
  return (
    <div className={className ? `${styles.mask} ${className}` : styles.mask} {...props}>
      <svg className={styles.defs} aria-hidden="true" focusable="false">
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          <path d={outline} transform={`scale(${1 / width} ${1 / height})`} />
        </clipPath>
      </svg>
      <div className={styles.content} style={{ clipPath: `url(#${id})` }}>
        {children}
      </div>
      <OrganicShape shape={shape} variant="stroke" path={outline} className={styles.outline} />
    </div>
  );
}
