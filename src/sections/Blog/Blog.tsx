import { ArticleCard } from '../../components/ArticleCard';
import { blogSection, posts, profile } from '../../content';
import { LiquidHoverProvider } from '../../three/LiquidHover';
import styles from './Blog.module.css';

export function Blog() {
  return (
    <section id="blog" className={styles.blog} aria-labelledby="blog-heading">
      <h2 id="blog-heading" className={styles.heading}>
        {blogSection.heading}
      </h2>
      <LiquidHoverProvider>
        <ul className={styles.cards}>
          {posts.map((post) => (
            <li key={post.url}>
              <ArticleCard post={post} mark={profile.monogram} />
            </li>
          ))}
        </ul>
      </LiquidHoverProvider>
    </section>
  );
}
