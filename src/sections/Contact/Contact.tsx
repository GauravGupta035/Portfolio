import { useRef, type CSSProperties } from 'react';
import { NavLink } from '../../components/NavLink';
import { TechTag } from '../../components/TechTag';
import { contactSection, navigation, profile } from '../../content';
import styles from './Contact.module.css';
import { useTagFloat } from './useTagFloat';

// The tag field's size in Figma Page 1 at 1440px. Tag positions are stored in
// these units and placed as percentages so the cloud scales with the viewport.
const fieldWidth = 1440;
const fieldHeight = 516;

const socialUrl = (label: string) => profile.socials.find((social) => social.label === label)?.url;

export function Contact() {
  const field = useRef<HTMLUListElement>(null);
  useTagFloat(field);
  const email = socialUrl('Email');

  return (
    <section
      id="contact"
      className={`surface-dark ${styles.contact}`}
      aria-labelledby="contact-heading"
    >
      <h2 id="contact-heading" className={styles.heading}>
        <a className={styles.headingLink} href={email}>
          {contactSection.heading}
        </a>
      </h2>
      <ul ref={field} className={styles.tags} aria-label={contactSection.tagsLabel}>
        {contactSection.tags.map(({ label, x, y }) => (
          <li
            key={label}
            className={styles.tag}
            style={
              {
                '--x': `${(x / fieldWidth) * 100}%`,
                '--y': `${(y / fieldHeight) * 100}%`,
              } as CSSProperties
            }
            data-tag
          >
            <TechTag>{label}</TechTag>
          </li>
        ))}
      </ul>
      <footer className={styles.footer}>
        <ul className={styles.links} aria-label={contactSection.linksLabel}>
          {contactSection.links.map((label) => {
            const url = socialUrl(label);
            const newTab = url && !url.startsWith('mailto:');
            return (
              <li key={label}>
                <NavLink
                  className={styles.link}
                  href={url}
                  {...(newTab && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  {label}
                </NavLink>
              </li>
            );
          })}
          <li>
            <NavLink
              className={styles.link}
              href={`${import.meta.env.BASE_URL}${profile.cvPath}`}
              external
            >
              {navigation.cvLabel}
            </NavLink>
          </li>
        </ul>
      </footer>
    </section>
  );
}
