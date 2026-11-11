import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { NavLink } from '../../components/NavLink';
import { OrganicShape } from '../../components/OrganicShape';
import { navigation, profile } from '../../content';
import styles from './Nav.module.css';

const desktopQuery = '(min-width: 768px)';

function useLocationHash() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const update = () => setHash(window.location.hash);
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return hash;
}

export function Nav() {
  const hash = useLocationHash();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const cvHref = `${import.meta.env.BASE_URL}${profile.cvPath}`;

  const close = () => {
    setOpen(false);
    menuButton.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>('a, button')?.focus();
    document.body.style.overflow = 'hidden';
    // The full-screen list only exists on narrow screens.
    const desktop = window.matchMedia?.(desktopQuery);
    const onChange = () => desktop?.matches && setOpen(false);
    desktop?.addEventListener('change', onChange);
    return () => {
      document.body.style.overflow = '';
      desktop?.removeEventListener('change', onChange);
    };
  }, [open]);

  const onPanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab' || !panel.current) return;
    const focusable = panel.current.querySelectorAll<HTMLElement>('a, button');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const links = (onNavigate?: () => void) => (
    <>
      {navigation.links.map(({ label, sectionId }) => (
        <li key={sectionId}>
          <NavLink href={`#${sectionId}`} active={hash === `#${sectionId}`} onClick={onNavigate}>
            {label}
          </NavLink>
        </li>
      ))}
      <li>
        <NavLink href={cvHref} external onClick={onNavigate}>
          {navigation.cvLabel}
        </NavLink>
      </li>
    </>
  );

  return (
    <header className={styles.nav} id="top">
      <a className={styles.logo} href="#top" aria-label={navigation.logoLabel}>
        <OrganicShape shape="logo" className={styles.logoShape} />
        <span className={styles.monogram} aria-hidden="true">
          {profile.monogram}
        </span>
      </a>
      <nav aria-label="Main">
        <ul className={styles.links}>{links()}</ul>
        <button
          ref={menuButton}
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen(true)}
        >
          {navigation.menuLabel}
        </button>
        {open && (
          <div
            ref={panel}
            id="nav-menu"
            className={styles.menu}
            role="dialog"
            aria-modal="true"
            aria-label={navigation.menuLabel}
            onKeyDown={onPanelKeyDown}
          >
            <button type="button" className={styles.closeButton} onClick={() => close()}>
              {navigation.closeLabel}
            </button>
            <ul className={styles.menuLinks}>{links(() => setOpen(false))}</ul>
          </div>
        )}
      </nav>
    </header>
  );
}
