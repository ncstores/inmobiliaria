import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle2, MessageCircle, MapPin, Maximize, Bed, Bath } from 'lucide-react';
import styles from './Properties.module.css';

function getGoogleMapsEmbedUrl(mapUrl, address) {
  const fallbackQuery = encodeURIComponent(address || '');

  if (!mapUrl || !mapUrl.trim()) {
    return `https://maps.google.com/maps?q=${fallbackQuery}&z=16&output=embed`;
  }

  const trimmedUrl = mapUrl.trim();

  if (trimmedUrl.includes('output=embed')) {
    return trimmedUrl;
  }

  const coordinates = trimmedUrl.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (coordinates) {
    return `https://maps.google.com/maps?q=${coordinates[1]},${coordinates[2]}&z=16&output=embed`;
  }

  const query = trimmedUrl.includes('maps.app.goo.gl') ? fallbackQuery : encodeURIComponent(trimmedUrl);
  return `https://maps.google.com/maps?q=${query}&z=16&output=embed`;
}

export default function PropertyDetailDrawer({ property, content, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!property) return null;

  const { title, price, expenses, location, address, mapUrl, bedrooms, bathrooms, surface, description, amenities, images } = property;
  const fullAddress = `${address}, ${location}, Argentina`;
  const propertyMapUrl = getGoogleMapsEmbedUrl(mapUrl, fullAddress);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Pre-configured WhatsApp URL
  const whatsAppNumber = content.whatsappNumber;
  const whatsAppText = `Hola ${content.brandName} ${content.brandSubtitle}, estoy interesado en el departamento "${title}" en ${location} (Ref: ${address}) que vi en su sitio web. ¿Podrían coordinar una visita o darme más detalles?`;
  const whatsAppLink = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(whatsAppText)}`;

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <div className={styles.drawerHeader}>
          <div className={styles.headerTitleArea}>
            <span className={styles.drawerBadge}>DEPARTAMENTO EN ALQUILER</span>
            <h2 className={styles.drawerTitle}>{title}</h2>
            <div className={styles.drawerAddress}>
              <MapPin size={16} className={styles.addressIcon} />
              <span>{address}, {location}</span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            <X size={24} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className={styles.drawerBody}>
          
          {/* Image Gallery */}
          <div className={styles.galleryContainer}>
            <div className={styles.mainImageWrapper}>
              <img src={images[activeImageIndex]} alt={title} className={styles.mainGalleryImage} />
            </div>
            <div className={styles.thumbnailsGrid}>
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  className={`${styles.thumbnailBtn} ${activeImageIndex === idx ? styles.thumbnailActive : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img} alt={`Vista ${idx + 1}`} className={styles.thumbnailImg} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Pricing Table */}
          <div className={styles.pricingCard}>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Alquiler Mensual</span>
              <span className={styles.priceVal}>{formatCurrency(price)}</span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Expensas Mensuales</span>
              <span className={styles.expensesVal}>{formatCurrency(expenses)}</span>
            </div>
            <hr className={styles.divider} />
            <div className={styles.priceRowTotal}>
              <span className={styles.totalLabel}>Total Estimado</span>
              <span className={styles.totalVal}>{formatCurrency(price + expenses)}</span>
            </div>
          </div>

          {/* Key Specifications Grid */}
          <div className={styles.specsGrid}>
            <div className={styles.specCard}>
              <Maximize size={20} className={styles.specIcon} />
              <span className={styles.specVal}>{surface} m²</span>
              <span className={styles.specLabel}>Sup. Total</span>
            </div>
            <div className={styles.specCard}>
              <Bed size={20} className={styles.specIcon} />
              <span className={styles.specVal}>{bedrooms === 0 ? 'Mono' : bedrooms}</span>
              <span className={styles.specLabel}>Dormitorios</span>
            </div>
            <div className={styles.specCard}>
              <Bath size={20} className={styles.specIcon} />
              <span className={styles.specVal}>{bathrooms}</span>
              <span className={styles.specLabel}>{bathrooms === 1 ? 'Baño' : 'Baños'}</span>
            </div>
            <div className={styles.specCard}>
              <Calendar size={20} className={styles.specIcon} />
              <span className={styles.specVal}>Inmediata</span>
              <span className={styles.specLabel}>Disponibilidad</span>
            </div>
          </div>

          {/* Description Section */}
          <div className={styles.detailsSection}>
            <h3 className={styles.sectionHeading}>Descripción de la propiedad</h3>
            <p className={styles.descriptionText}>{description}</p>
          </div>

          {/* Amenities checklist */}
          <div className={styles.detailsSection}>
            <h3 className={styles.sectionHeading}>Comodidades y Características</h3>
            <div className={styles.amenitiesGrid}>
              {amenities.map((amenity, idx) => (
                <div key={idx} className={styles.amenityItem}>
                  <CheckCircle2 size={16} className={styles.checkIcon} />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.detailsSection}>
            <h3 className={styles.sectionHeading}>Ubicación</h3>
            <div className={styles.propertyMapWrapper}>
              <iframe
                title={`Google Maps - ${title}`}
                src={propertyMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Direct CTA Panel */}
          <div className={styles.ctaPanel}>
            <a 
              href={whatsAppLink} 
              target="_blank" 
              rel="noreferrer" 
              className={`btn btn-secondary ${styles.waActionBtn}`}
            >
              <MessageCircle size={20} />
              Consultar por WhatsApp
            </a>
            <p className={styles.ctaSubtext}>
              Serás redirigido para chatear con uno de nuestros asesores de {content.brandName} {content.brandSubtitle}.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
