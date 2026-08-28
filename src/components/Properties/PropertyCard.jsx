import React from 'react';
import { Bed, Bath, Maximize, MapPin } from 'lucide-react';
import styles from './Properties.module.css';

export default function PropertyCard({ property, onSelect }) {
  const { title, price, expenses, location, address, bedrooms, bathrooms, surface, operation, images } = property;
  const isRented = operation === 'Alquilado';

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className={`${styles.card} ${isRented ? styles.rentedCard : ''}`} onClick={() => onSelect(property)}>
      <div className={styles.imageContainer}>
        <img src={images[0]} alt={title} className={styles.image} />
        <span className={`${styles.operationBadge} ${isRented ? styles.rentedBadge : ''}`}>{operation}</span>
        <span className={styles.typeBadge}>{property.type}</span>
        {isRented && <span className={styles.rentedOverlay}>Alquilado</span>}
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.priceContainer}>
          <h4 className={styles.price}>{formatCurrency(price)} <span className={styles.pricePeriod}>/ mes</span></h4>
          {expenses > 0 && (
            <span className={styles.expenses}>+ {formatCurrency(expenses)} expensas</span>
          )}
        </div>

        <h3 className={styles.title}>{title}</h3>

        <div className={styles.locationContainer}>
          <MapPin size={14} className={styles.locationIcon} />
          <span className={styles.locationText}>{location} &bull; {address}</span>
        </div>

        <div className={styles.features}>
          <div className={styles.featureItem} title="Dormitorios">
            <Bed size={16} />
            <span>{bedrooms === 0 ? 'Monoambiente' : `${bedrooms} Dorm.`}</span>
          </div>
          <div className={styles.featureItem} title="Baños">
            <Bath size={16} />
            <span>{bathrooms} {bathrooms === 1 ? 'Baño' : 'Baños'}</span>
          </div>
          <div className={styles.featureItem} title="Superficie">
            <Maximize size={16} />
            <span>{surface} m²</span>
          </div>
        </div>

        <button 
          className={`btn btn-outline ${styles.viewBtn}`}
          onClick={(e) => {
            e.stopPropagation(); // Avoid triggering card click twice
            onSelect(property);
          }}
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );
}
