import React from 'react';
import { Building2, ArrowUp } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer({ content }) {
  const hasValue = (value) => Boolean(value && value.trim());
  const hasSocials = hasValue(content.facebookUrl) || hasValue(content.instagramUrl) || hasValue(content.linkedinUrl);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} ${styles.containerCompact} container`}>
        
        {/* Brand Column */}
        <div className={styles.brandCol}>
          <div className={styles.logo}>
            <div className={styles.iconWrapper}>
              {content.logoImage ? (
                <img src={content.logoImage} alt={`${content.brandName} ${content.brandSubtitle}`} className={styles.logoImage} />
              ) : (
                <Building2 size={24} />
              )}
            </div>
            <div className={styles.logoText}>
              <span className={styles.brandName}>{content.brandName}</span>
              <span className={styles.brandSubtitle}>{content.brandSubtitle}</span>
            </div>
          </div>
          {hasValue(content.footerMotto) && (
            <p className={styles.motto}>
              {content.footerMotto}
            </p>
          )}
          {hasSocials && (
            <div className={styles.socials}>
              {hasValue(content.facebookUrl) && (
                <a href={content.facebookUrl} target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Facebook">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
              )}
              {hasValue(content.instagramUrl) && (
                <a href={content.instagramUrl} target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Instagram">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              )}
              {hasValue(content.linkedinUrl) && (
                <a href={content.linkedinUrl} target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Quick Links Column */}
        <div className={styles.linksCol}>
          <h4 className={styles.colTitle}>Navegación</h4>
          <ul className={styles.linksList}>
            <li><a href="#inicio" onClick={(e) => handleLinkClick(e, 'inicio')}>Inicio</a></li>
            <li><a href="#propiedades" onClick={(e) => handleLinkClick(e, 'propiedades')}>Propiedades</a></li>
            <li><a href="#contacto" onClick={(e) => handleLinkClick(e, 'contacto')}>Contacto</a></li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={`${styles.bottomContainer} container`}>
          <span className={styles.copyright}>
            &copy; {new Date().getFullYear()} {content.brandName} {content.brandSubtitle}. Todos los derechos reservados.
          </span>
          <button onClick={scrollToTop} className={styles.scrollTopBtn} aria-label="Volver arriba">
            <ArrowUp size={16} />
            Subir
          </button>
        </div>
      </div>
    </footer>
  );
}
