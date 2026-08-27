import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import PropertyFilters from './components/Properties/PropertyFilters';
import PropertyGrid from './components/Properties/PropertyGrid';
import PropertyDetailDrawer from './components/Properties/PropertyDetailDrawer';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import AdminPanel from './components/Admin/AdminPanel';
import { getStoredLocations, getStoredProperties, getStoredTypes } from './data/propertiesMockData';
import { getStoredSiteContent } from './data/siteContent';

export default function App() {
  const [view, setView] = useState('public'); // 'public' | 'admin'
  const [allProperties, setAllProperties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [types, setTypes] = useState([]);
  const [siteContent, setSiteContent] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filters, setFilters] = useState({
    location: 'Todos',
    type: 'Todos',
    minPrice: '',
    maxPrice: ''
  });
  const [filteredProperties, setFilteredProperties] = useState([]);

  // Routing detection (support for /admin and #admin)
  useEffect(() => {
    const handleRouting = () => {
      const isAdmin = window.location.pathname === '/admin' || window.location.hash === '#admin';
      setView(isAdmin ? 'admin' : 'public');
    };

    handleRouting(); // Initial check

    window.addEventListener('hashchange', handleRouting);
    window.addEventListener('popstate', handleRouting);

    return () => {
      window.removeEventListener('hashchange', handleRouting);
      window.removeEventListener('popstate', handleRouting);
    };
  }, []);

  // Fetch properties from localStorage when view resets to public or admin updates
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const [storedProperties, storedLocations, storedTypes, storedContent] = await Promise.all([
        getStoredProperties(),
        getStoredLocations(),
        getStoredTypes(),
        getStoredSiteContent()
      ]);

      if (!isMounted) return;

      setAllProperties(storedProperties);
      setLocations(storedLocations);
      setTypes(storedTypes);
      setSiteContent(storedContent);
      setIsLoadingData(false);
    }

    setIsLoadingData(true);
    loadData();

    return () => {
      isMounted = false;
    };
  }, [view]);

  // Core filtering logic
  useEffect(() => {
    let result = allProperties;

    // Filter by location
    if (filters.location !== 'Todos') {
      result = result.filter(p => p.location === filters.location);
    }

    // Filter by type (number of bedrooms)
    if (filters.type !== 'Todos') {
      result = result.filter(p => p.type === filters.type);
    }

    // Filter by min price
    if (filters.minPrice !== '') {
      result = result.filter(p => p.price >= parseInt(filters.minPrice));
    }

    // Filter by max price
    if (filters.maxPrice !== '') {
      result = result.filter(p => p.price <= parseInt(filters.maxPrice));
    }

    setFilteredProperties(result);
  }, [filters, allProperties]);

  // Handler for search trigger from Hero
  const handleHeroSearch = (searchParams) => {
    setFilters({
      location: searchParams.location,
      type: searchParams.type,
      minPrice: '',
      maxPrice: searchParams.maxPrice !== Infinity ? searchParams.maxPrice : ''
    });
  };

  const handleClearFilters = () => {
    setFilters({
      location: 'Todos',
      type: 'Todos',
      minPrice: '',
      maxPrice: ''
    });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleBackToSite = () => {
    window.location.hash = '';
    if (window.location.pathname === '/admin') {
      window.history.pushState({}, '', '/');
    }
    setView('public');
  };

  if (view === 'admin') {
    return <AdminPanel onBackToSite={handleBackToSite} />;
  }

  if (isLoadingData || !siteContent) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-light)' }} aria-label="Cargando sitio" />
    );
  }

  return (
    <>
      <Header content={siteContent} />
      <Hero onSearch={handleHeroSearch} locations={locations} types={types} content={siteContent} />
      
      {/* Catalog / Properties Section */}
      <section id="propiedades" className="section" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-red">{siteContent.catalogBadge}</span>
            <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '12px', marginBottom: '16px' }}>
              {siteContent.catalogTitle}
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '16px' }}>
              {siteContent.catalogSubtitle}
            </p>
          </div>

          <PropertyFilters 
            filters={filters} 
            locations={locations}
            types={types}
            onChange={handleFilterChange} 
            onClear={handleClearFilters}
          />
          
          <PropertyGrid 
            properties={filteredProperties} 
            onSelectProperty={setSelectedProperty}
            onResetFilters={handleClearFilters}
          />

        </div>
      </section>

      <Contact content={siteContent} />
      
      <Footer content={siteContent} />

      {/* Detail Slideout Drawer */}
      {selectedProperty && (
        <PropertyDetailDrawer 
          property={selectedProperty} 
          content={siteContent}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </>
  );
}
