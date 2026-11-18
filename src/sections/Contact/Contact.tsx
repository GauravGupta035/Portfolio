import { NavLink } from '../../components/NavLink';
import { contactSection, navigation, profile } from '../../content';
import styles from './Contact.module.css';

const socialUrl = (label: string) => profile.socials.find((social) => social.label === label)?.url;

export function Contact() {
  return (
    <footer id="contact" className={`surface-dark ${styles.contact}`}>
      <ul className={styles.links} aria-label={contactSection.linksLabel}>
        {contactSection.links.map((label) => {
          const url = socialUrl(label);
          const newTab = url && !url.startsWith('mailto:');
          return (
            <li key={label}>
              <NavLink className={styles.link} href={url} external={!!newTab} arrow>
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
  );
}
