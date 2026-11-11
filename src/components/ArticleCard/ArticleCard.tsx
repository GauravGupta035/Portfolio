import type { Post } from '../../content';
import styles from './ArticleCard.module.css';

type ArticleCardProps = {
  post: Post;
  /** Short mark drawn at each corner of the card. */
  mark: string;
};

/** Blog / Article Card: one link to the post, with the dark variant on hover and focus. */
export function ArticleCard({ post, mark }: ArticleCardProps) {
  return (
    <div className={styles.frame}>
      <span className={styles.marks} aria-hidden="true">
        <span>{mark}</span>
        <span>{mark}</span>
      </span>
      <a className={styles.card} href={post.url} target="_blank" rel="noopener noreferrer">
        <img
          className={styles.image}
          src={`${import.meta.env.BASE_URL}${post.image.src}`}
          alt={post.image.alt}
          width={660}
          height={528}
          loading="lazy"
          decoding="async"
        />
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
      </a>
      <span className={styles.marks} aria-hidden="true">
        <span>{mark}</span>
        <span>{mark}</span>
      </span>
    </div>
  );
}
