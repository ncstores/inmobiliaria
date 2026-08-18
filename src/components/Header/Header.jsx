import React, { useState, useEffect } from 'react';
import { Building2, Menu, X, PhoneCall } from 'lucide-react';
import styles from './Header.module.css';

export default function Header({ content }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    setIsOpen(false);
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
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`${styles.container} container`}>
        <a href="#inicio" className={styles.logo} onClick={(e) => handleLinkClick(e, 'inicio')}>
          <div className={styles.iconContainer}>
            {content.logoImage ? (
              <img src={content.logoImage} alt={`${content.brandName} ${content.brandSubtitle}`} className={styles.logoImage} />
            ) : (
              <Building2 className={styles.logoIcon} size={28} />
            )}
          </div>
          <div className={styles.logoText}>
            <span className={styles.brandName}>{content.brandName}</span>
            <span className={styles.brandSubtitle}>{content.brandSubtitle}</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav}>
          <a href="#inicio" onClick={(e) => handleLinkClick(e, 'inicio')} className={styles.navLink}>Inicio</a>
          <a href="#propiedades" onClick={(e) => handleLinkClick(e, 'propiedades')} className={styles.navLink}>Propiedades</a>
          <a href="#contacto" onClick={(e) => handleLinkClick(e, 'contacto')} className={styles.navLink}>Contacto</a>
        </nav>

        <div className={styles.ctaDesktop}>
          <a href={`https://wa.me/${content.whatsappNumber}`} target="_blank" rel="noreferrer" className="btn btn-secondary">
            <PhoneCall size={16} />
            {content.headerCtaText}
          </a>
        </div>

        {/* Hamburger Menu Icon */}
        <button className={styles.mobileMenuBtn} onClick={toggleMenu} aria-label="Menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer/Nav */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            <a href="#inicio" onClick={(e) => handleLinkClick(e, 'inicio')} className={styles.mobileNavLink}>Inicio</a>
            <a href="#propiedades" onClick={(e) => handleLinkClick(e, 'propiedades')} className={styles.mobileNavLink}>Propiedades</a>
            <a href="#contacto" onClick={(e) => handleLinkClick(e, 'contacto')} className={styles.mobileNavLink}>Contacto</a>
            <a 
              href={`https://wa.me/${content.whatsappNumber}`} 
              target="_blank" 
              rel="noreferrer" 
              className={`${styles.mobileNavLink} ${styles.mobileCta}`}
            >
              {content.headerCtaText}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
