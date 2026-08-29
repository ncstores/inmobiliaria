import React, { useState } from 'react';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero({ onSearch, locations, types, content }) {
  const locationsList = ['Todos', ...locations];
  const typesList = ['Todos', ...types];
  const [selectedLocation, setSelectedLocation] = useState('Todos');
  const [selectedType, setSelectedType] = useState('Todos');
  const [maxPrice, setMaxPrice] = useState('');
  const overlayOpacity = Math.min(100, Math.max(0, Number(content.heroOverlayOpacity) || 45)) / 100;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch({
      location: selectedLocation,
      type: selectedType,
      maxPrice: maxPrice ? parseInt(maxPrice) : Infinity
    });
    
    // Scroll to properties section
    const propertiesSection = document.getElementById('propiedades');
    if (propertiesSection) {
      const headerOffset = 80;
      const elementPosition = propertiesSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="inicio" className={styles.heroSection}>
      <div
        className={styles.heroBg}
        style={content.heroBackgroundImage ? { backgroundImage: `url(${content.heroBackgroundImage})` } : undefined}
      ></div>
      <div
        className={styles.heroOverlay}
        style={{
          background: `linear-gradient(135deg, rgba(183, 28, 28, ${overlayOpacity}) 0%, rgba(15, 23, 42, ${overlayOpacity}) 100%)`
        }}
      ></div>
      
      <div className={`${styles.contentContainer} container`}>
        <div className={styles.heroTextContent}>
          <span className={styles.welcomeBadge}>{content.heroBadge}</span>
          <h1 className={styles.mainTitle}>
            {content.heroTitle}
          </h1>
          <p className={styles.subtitle}>
            {content.heroSubtitle}
          </p>
          <div className={styles.quickStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{content.heroStat1Number}</span>
              <span className={styles.statLabel}>{content.heroStat1Label}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{content.heroStat2Number}</span>
              <span className={styles.statLabel}>{content.heroStat2Label}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{content.heroStat3Number}</span>
              <span className={styles.statLabel}>{content.heroStat3Label}</span>
            </div>
          </div>
        </div>

        {/* Search Bar Form */}
        <div className={styles.searchPanel}>
          <h3 className={styles.searchTitle}>Encontrá tu próximo departamento</h3>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <MapPin size={16} className={styles.inputIcon} />
                Ubicación
              </label>
              <select 
                value={selectedLocation} 
                onChange={(e) => setSelectedLocation(e.target.value)}
                className={styles.select}
              >
                {locationsList.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc === 'Todos' ? 'Todas las zonas' : loc}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Home size={16} className={styles.inputIcon} />
                Dormitorios
              </label>
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                className={styles.select}
              >
                {typesList.map((t) => (
                  <option key={t} value={t}>
                    {t === 'Todos' ? 'Cualquier tipología' : t}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <DollarSign size={16} className={styles.inputIcon} />
                Precio Máximo (ARS)
              </label>
              <input 
                type="number" 
                placeholder="Ej. 500000" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(e.target.value)}
                className={styles.input}
                min="0"
              />
            </div>

            <button type="submit" className={`btn btn-primary ${styles.searchBtn}`}>
              <Search size={18} />
              Buscar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
