import React from 'react';
import { Building2, ArrowUp } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer({ content }) {
  const hasValue = (value) => Boolean(value && value.trim());
  const hasSocials = hasValue(content.facebookUrl) || hasValue(content.instagramUrl) || hasValue(content.linkedinUrl) || hasValue(content.whatsappNumber);

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
              {hasValue(content.whatsappNumber) && (
                <a href={`https://wa.me/${content.whatsappNumber}`} target="_blank" rel="noreferrer" className={`${styles.socialLink} ${styles.whatsappLink}`} aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2.05 22l5.27-1.38a9.9 9.9 0 0 0 4.72 1.2h.01c5.46 0 9.91-4.45 9.91-9.91S17.51 2 12.04 2Zm0 18.14h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.13.82.84-3.05-.2-.31a8.17 8.17 0 0 1-1.25-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.8-.23-.08-.4-.12-.57.12-.17.25-.65.8-.8.97-.15.17-.3.19-.55.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.3.37-.45.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.57-1.38-.78-1.89-.2-.49-.41-.42-.57-.43h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09 0 1.23.9 2.42 1.02 2.59.12.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.29Z" />
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
            <span className={styles.creatorCredit}>
              Sitio creado por <a href="https://www.ncstores.com.ar" target="_blank" rel="noreferrer">www.ncstores.com.ar</a>
            </span>
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
