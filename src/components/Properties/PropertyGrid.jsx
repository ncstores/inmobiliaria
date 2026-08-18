import React from 'react';
import PropertyCard from './PropertyCard';
import { Home } from 'lucide-react';
import styles from './Properties.module.css';

export default function PropertyGrid({ properties, onSelectProperty, onResetFilters }) {
  if (properties.length === 0) {
    return (
      <div className={styles.noResults}>
        <div className={styles.noResultsIconWrapper}>
          <Home size={48} className={styles.noResultsIcon} />
        </div>
        <h3 className={styles.noResultsTitle}>No encontramos propiedades que coincidan</h3>
        <p className={styles.noResultsText}>
          Intentá modificando los filtros de búsqueda o el rango de precios para ver más opciones disponibles.
        </p>
        <button className="btn btn-primary" onClick={onResetFilters}>
          Ver Todas las Propiedades
        </button>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {properties.map((property) => (
        <PropertyCard 
          key={property.id} 
          property={property} 
          onSelect={onSelectProperty} 
        />
      ))}
    </div>
  );
}
