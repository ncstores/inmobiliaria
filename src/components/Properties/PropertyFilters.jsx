import React from 'react';
import { Filter, RotateCcw, MapPin, Home, DollarSign } from 'lucide-react';
import styles from './Properties.module.css';

export default function PropertyFilters({ filters, locations, types, onChange, onClear }) {
  const locationsList = ['Todos', ...locations];
  const typesList = ['Todos', ...types];
  
  const handleLocationChange = (e) => {
    onChange({ ...filters, location: e.target.value });
  };

  const handleTypeChange = (e) => {
    onChange({ ...filters, type: e.target.value });
  };

  const handleMinPriceChange = (e) => {
    onChange({ ...filters, minPrice: e.target.value ? parseInt(e.target.value) : '' });
  };

  const handleMaxPriceChange = (e) => {
    onChange({ ...filters, maxPrice: e.target.value ? parseInt(e.target.value) : '' });
  };

  const hasActiveFilters = 
    filters.location !== 'Todos' || 
    filters.type !== 'Todos' || 
    filters.minPrice !== '' || 
    filters.maxPrice !== '';

  return (
    <div className={styles.filtersWrapper}>
      <div className={styles.filtersHeader}>
        <div className={styles.filtersTitle}>
          <Filter size={18} className={styles.titleIcon} />
          <span>Filtros de Búsqueda</span>
        </div>
        {hasActiveFilters && (
          <button onClick={onClear} className={styles.clearBtn} title="Limpiar Filtros">
            <RotateCcw size={14} />
            Restablecer
          </button>
        )}
      </div>

      <div className={styles.filtersGrid}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            <MapPin size={14} />
            Zona / Barrio
          </label>
          <select 
            value={filters.location} 
            onChange={handleLocationChange}
            className={styles.filterSelect}
          >
            {locationsList.map((loc) => (
              <option key={loc} value={loc}>
                {loc === 'Todos' ? 'Todas las zonas' : loc}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            <Home size={14} />
            Dormitorios
          </label>
          <select 
            value={filters.type} 
            onChange={handleTypeChange}
            className={styles.filterSelect}
          >
            {typesList.map((t) => (
              <option key={t} value={t}>
                {t === 'Todos' ? 'Cualquier tipología' : t}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            <DollarSign size={14} />
            Precio Mínimo
          </label>
          <input 
            type="number" 
            placeholder="Mínimo"
            value={filters.minPrice} 
            onChange={handleMinPriceChange}
            className={styles.filterInput}
            min="0"
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            <DollarSign size={14} />
            Precio Máximo
          </label>
          <input 
            type="number" 
            placeholder="Máximo"
            value={filters.maxPrice} 
            onChange={handleMaxPriceChange}
            className={styles.filterInput}
            min="0"
          />
        </div>
      </div>
    </div>
  );
}
