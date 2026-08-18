import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, LogOut, Building, TrendingUp, Coins, Lock, X, ExternalLink } from 'lucide-react';
import { getStoredLocations, getStoredProperties, getStoredTypes, saveLocations, saveProperties, saveTypes } from '../../data/propertiesMockData';
import { defaultSiteContent, getStoredSiteContent, saveSiteContent } from '../../data/siteContent';
import { hasSupabaseConfig, supabase } from '../../data/supabaseClient';
import styles from './AdminPanel.module.css';

const contentSections = [
  {
    title: 'Marca y Encabezado',
    fields: [
      ['brandName', 'Nombre de marca'],
      ['brandSubtitle', 'Subtítulo de marca'],
      ['headerCtaText', 'Texto botón WhatsApp']
    ]
  },
  {
    title: 'Portada Principal',
    fields: [
      ['heroBadge', 'Etiqueta'],
      ['heroTitle', 'Título principal', 'textarea'],
      ['heroSubtitle', 'Texto principal', 'textarea'],
      ['heroStat1Number', 'Estadística 1 - Número'],
      ['heroStat1Label', 'Estadística 1 - Texto'],
      ['heroStat2Number', 'Estadística 2 - Número'],
      ['heroStat2Label', 'Estadística 2 - Texto'],
      ['heroStat3Number', 'Estadística 3 - Número'],
      ['heroStat3Label', 'Estadística 3 - Texto']
    ]
  },
  {
    title: 'Catálogo',
    fields: [
      ['catalogBadge', 'Etiqueta'],
      ['catalogTitle', 'Título'],
      ['catalogSubtitle', 'Descripción', 'textarea']
    ]
  },
  {
    title: 'Servicios',
    fields: [
      ['servicesBadge', 'Etiqueta'],
      ['servicesTitle', 'Título'],
      ['servicesSubtitle', 'Descripción', 'textarea'],
      ['service1Title', 'Servicio 1 - Título'],
      ['service1Description', 'Servicio 1 - Descripción', 'textarea'],
      ['service2Title', 'Servicio 2 - Título'],
      ['service2Description', 'Servicio 2 - Descripción', 'textarea'],
      ['service3Title', 'Servicio 3 - Título'],
      ['service3Description', 'Servicio 3 - Descripción', 'textarea'],
      ['service4Title', 'Servicio 4 - Título'],
      ['service4Description', 'Servicio 4 - Descripción', 'textarea']
    ]
  },
  {
    title: 'Nosotros',
    fields: [
      ['aboutBadge', 'Etiqueta'],
      ['aboutTitle', 'Título'],
      ['aboutLead', 'Texto destacado', 'textarea'],
      ['aboutDescription', 'Descripción', 'textarea'],
      ['aboutExperienceNumber', 'Experiencia - Número'],
      ['aboutExperienceText', 'Experiencia - Texto'],
      ['value1Title', 'Valor 1 - Título'],
      ['value1Description', 'Valor 1 - Descripción', 'textarea'],
      ['value2Title', 'Valor 2 - Título'],
      ['value2Description', 'Valor 2 - Descripción', 'textarea'],
      ['value3Title', 'Valor 3 - Título'],
      ['value3Description', 'Valor 3 - Descripción', 'textarea']
    ]
  },
  {
    title: 'Contacto, WhatsApp y Mapa',
    fields: [
      ['contactBadge', 'Etiqueta'],
      ['contactTitle', 'Título'],
      ['contactSubtitle', 'Descripción', 'textarea'],
      ['contactAddressLabel', 'Rótulo dirección'],
      ['contactAddress', 'Dirección'],
      ['contactPhoneLabel', 'Rótulo teléfono'],
      ['contactPhone', 'Teléfono visible'],
      ['contactPhoneHref', 'Teléfono para botón llamar'],
      ['contactEmailLabel', 'Rótulo email'],
      ['contactEmail', 'Email'],
      ['contactHoursLabel', 'Rótulo horarios'],
      ['contactHours', 'Horarios'],
      ['whatsappNumber', 'Número WhatsApp sin + ni espacios'],
      ['googleMapsUrl', 'URL de Google Maps', 'textarea']
    ]
  },
  {
    title: 'Footer y Redes',
    fields: [
      ['footerMotto', 'Texto institucional', 'textarea'],
      ['facebookUrl', 'URL Facebook'],
      ['instagramUrl', 'URL Instagram'],
      ['linkedinUrl', 'URL LinkedIn']
    ]
  }
];

const ADMIN_AUTH_KEY = 'vergnano_admin_auth';
const ADMIN_RESET_KEY = 'vergnano_admin_reset';
const LEGACY_ADMIN_PASSWORD = 'admin123';

const bytesToHex = (bytes) => Array.from(bytes).map((byte) => byte.toString(16).padStart(2, '0')).join('');

const createSalt = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
};

const hashPassword = async (password, salt) => {
  const encoded = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return bytesToHex(new Uint8Array(digest));
};

const getStoredAuth = async () => {
  if (hasSupabaseConfig) {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', ADMIN_AUTH_KEY)
      .maybeSingle();

    if (!error && data) return data.value;

    if (error) console.error('Error reading admin auth from Supabase', error);
  }

  try {
    const raw = localStorage.getItem(ADMIN_AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Error reading admin auth', e);
    return null;
  }
};

const saveAdminPassword = async (newPassword) => {
  const salt = createSalt();
  const passwordHash = await hashPassword(newPassword, salt);
  const authData = { salt, passwordHash, updatedAt: Date.now() };

  if (hasSupabaseConfig) {
    const { error } = await supabase
      .from('app_settings')
      .upsert({ key: ADMIN_AUTH_KEY, value: authData, updated_at: new Date().toISOString() });

    if (!error) return;

    console.error('Error writing admin auth to Supabase', error);
  }

  localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(authData));
};

const verifyAdminPassword = async (password) => {
  const auth = await getStoredAuth();

  if (!auth) {
    if (password === LEGACY_ADMIN_PASSWORD) {
      await saveAdminPassword(password);
      return true;
    }
    return false;
  }

  const passwordHash = await hashPassword(password, auth.salt);
  return passwordHash === auth.passwordHash;
};

export default function AdminPanel({ onBackToSite }) {
  const [properties, setProperties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [types, setTypes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [securityForm, setSecurityForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '', recoveryCode: '' });
  const [securityMessage, setSecurityMessage] = useState('');
  const [securityError, setSecurityError] = useState('');
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [activeTab, setActiveTab] = useState('properties');
  const [formData, setFormData] = useState({
    title: '',
    type: 'Monoambiente',
    price: '',
    expenses: '',
    location: 'Nueva Córdoba',
    customLocation: '',
    address: '',
    mapUrl: '',
    bedrooms: '0',
    bathrooms: '1',
    surface: '',
    description: '',
    amenitiesStr: '',
    images: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [locationName, setLocationName] = useState('');
  const [editingLocation, setEditingLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [typeName, setTypeName] = useState('');
  const [editingType, setEditingType] = useState(null);
  const [typeError, setTypeError] = useState('');
  const [contentForm, setContentForm] = useState(defaultSiteContent);
  const [contentSaved, setContentSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAdminData() {
      const [storedProperties, storedLocations, storedTypes, storedContent] = await Promise.all([
        getStoredProperties(),
        getStoredLocations(),
        getStoredTypes(),
        getStoredSiteContent()
      ]);

      if (!isMounted) return;

      setProperties(storedProperties);
      setLocations(storedLocations);
      setTypes(storedTypes);
      setContentForm(storedContent);
    }

    loadAdminData();

    return () => {
      isMounted = false;
    };
  }, []);

  const defaultLocation = locations[0] || 'Nueva Córdoba';
  const defaultType = types[0] || 'Monoambiente';

  // Quick stats calculation
  const totalProperties = properties.length;
  const avgPrice = totalProperties > 0 
    ? Math.round(properties.reduce((acc, curr) => acc + curr.price, 0) / totalProperties) 
    : 0;
  const maxPrice = totalProperties > 0 
    ? Math.max(...properties.map(p => p.price)) 
    : 0;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const isValidPassword = await verifyAdminPassword(password);

    if (isValidPassword) {
      setIsLoggedIn(true);
      setLoginError('');
      setPassword('');
    } else {
      setLoginError('Contraseña incorrecta. Intente de nuevo.');
    }
  };

  const handleSendRecoveryEmail = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;
    localStorage.setItem(ADMIN_RESET_KEY, JSON.stringify({ code, expiresAt }));

    const adminEmail = contentForm.contactEmail || 'info@administracionesvergano.com.ar';
    const subject = encodeURIComponent('Código de recuperación del panel admin');
    const body = encodeURIComponent(`Código temporal para recuperar acceso al panel admin: ${code}\n\nEste código vence en 15 minutos. Si no solicitaste este acceso, ignorá este mensaje.`);
    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
    setResetMessage(`Se preparó un correo para ${adminEmail}. Enviá ese mail y usá el código temporal para cambiar la contraseña.`);
  };

  const verifyRecoveryCode = (code) => {
    try {
      const raw = localStorage.getItem(ADMIN_RESET_KEY);
      if (!raw) return false;

      const stored = JSON.parse(raw);
      if (Date.now() > stored.expiresAt) {
        localStorage.removeItem(ADMIN_RESET_KEY);
        return false;
      }

      return stored.code === code.trim();
    } catch (e) {
      console.error('Error reading recovery code', e);
      return false;
    }
  };

  const handleResetLogin = async (e) => {
    e.preventDefault();

    if (!verifyRecoveryCode(resetCode)) {
      setLoginError('Código inválido o vencido.');
      return;
    }

    setIsLoggedIn(true);
    setActiveTab('security');
    setLoginError('');
    setResetCode('');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta propiedad? Esta acción no se puede deshacer.')) {
      const updated = properties.filter(p => p.id !== id);
      setProperties(updated);
      await saveProperties(updated);
    }
  };

  const openAddModal = () => {
    setEditingProperty(null);
    setFormData({
      title: '',
      type: defaultType,
      price: '',
      expenses: '',
      location: defaultLocation,
      customLocation: '',
      address: '',
      mapUrl: '',
      bedrooms: '0',
      bathrooms: '1',
      surface: '',
      description: '',
      amenitiesStr: '',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80'
      ]
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      type: types.includes(property.type) ? property.type : defaultType,
      price: property.price.toString(),
      expenses: property.expenses.toString(),
      location: locations.includes(property.location) ? property.location : 'Otro',
      customLocation: !locations.includes(property.location) ? property.location : '',
      address: property.address,
      mapUrl: property.mapUrl || '',
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      surface: property.surface.toString(),
      description: property.description,
      amenitiesStr: property.amenities ? property.amenities.join(', ') : '',
      images: property.images || []
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    let err = {};
    if (!formData.title.trim()) err.title = 'El título es obligatorio.';
    if (!formData.price.trim() || isNaN(formData.price)) err.price = 'Debe ingresar un precio válido.';
    if (!formData.expenses.trim() || isNaN(formData.expenses)) err.expenses = 'Debe ingresar expensas válidas (puede ser 0).';
    if (!formData.address.trim()) err.address = 'La dirección es obligatoria.';
    if (!formData.surface.trim() || isNaN(formData.surface)) err.surface = 'Debe ingresar una superficie en m².';
    if (!formData.description.trim()) err.description = 'La descripción es obligatoria.';
    if (formData.location === 'Otro' && !formData.customLocation.trim()) {
      err.customLocation = 'Escriba el nombre del barrio.';
    }

    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const actualLocation = formData.location === 'Otro' ? formData.customLocation.trim() : formData.location;
    const imagesArray = formData.images.map((image) => image.trim()).filter(Boolean);

    // If no images provided, fall back to default
    if (imagesArray.length === 0) {
      imagesArray.push("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80");
    }

    const amenitiesList = formData.amenitiesStr
      ? formData.amenitiesStr.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const newProperty = {
      id: editingProperty ? editingProperty.id : Date.now(),
      title: formData.title.trim(),
      type: formData.type,
      price: parseInt(formData.price),
      expenses: parseInt(formData.expenses),
      location: actualLocation,
      address: formData.address.trim(),
      mapUrl: formData.mapUrl.trim(),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseFloat(formData.bathrooms),
      surface: parseInt(formData.surface),
      operation: 'Alquiler',
      description: formData.description.trim(),
      amenities: amenitiesList,
      images: imagesArray
    };

    let updatedList;
    if (editingProperty) {
      updatedList = properties.map(p => p.id === editingProperty.id ? newProperty : p);
    } else {
      updatedList = [newProperty, ...properties];
    }

    setProperties(updatedList);
    await saveProperties(updatedList);
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resizeImageFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();

        img.onload = () => {
          const maxSize = 1200;
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };

        img.onerror = reject;
        img.src = reader.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const imageData = await Promise.all(files.map(resizeImageFile));
      setFormData((current) => ({
        ...current,
        images: [...current.images, ...imageData]
      }));
    } catch (error) {
      console.error('Error loading image files', error);
      window.alert('No se pudieron cargar las imágenes. Verifique que sean archivos de imagen válidos.');
    } finally {
      e.target.value = '';
    }
  };

  const addImageUrl = () => {
    setFormData((current) => ({ ...current, images: [...current.images, ''] }));
  };

  const updateImageUrl = (index, value) => {
    setFormData((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) => imageIndex === index ? value : image)
    }));
  };

  const clearImage = (index) => {
    setFormData((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index)
    }));
  };

  const handleLogoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const logoImage = await resizeImageFile(file);
      setContentForm((current) => ({ ...current, logoImage }));
      setContentSaved(false);
    } catch (error) {
      console.error('Error loading logo file', error);
      window.alert('No se pudo cargar el logo. Verifique que sea un archivo de imagen válido.');
    } finally {
      e.target.value = '';
    }
  };

  const clearLogo = () => {
    setContentForm((current) => ({ ...current, logoImage: '' }));
    setContentSaved(false);
  };

  const handleContentChange = (e) => {
    const { name, value } = e.target;
    setContentForm((current) => ({ ...current, [name]: value }));
    setContentSaved(false);
  };

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    await saveSiteContent(contentForm);
    setContentSaved(true);
    setTimeout(() => setContentSaved(false), 2500);
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityForm((current) => ({ ...current, [name]: value }));
    setSecurityMessage('');
    setSecurityError('');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword, recoveryCode } = securityForm;

    if (newPassword.length < 6) {
      setSecurityError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityError('La nueva contraseña y la confirmación no coinciden.');
      return;
    }

    const canChangeWithCurrentPassword = currentPassword ? await verifyAdminPassword(currentPassword) : false;
    const canChangeWithRecoveryCode = recoveryCode ? verifyRecoveryCode(recoveryCode) : false;

    if (!canChangeWithCurrentPassword && !canChangeWithRecoveryCode) {
      setSecurityError('Ingrese la contraseña actual correcta o un código de recuperación válido.');
      return;
    }

    await saveAdminPassword(newPassword);
    localStorage.removeItem(ADMIN_RESET_KEY);
    setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '', recoveryCode: '' });
    setSecurityError('');
    setSecurityMessage('Contraseña actualizada correctamente.');
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    const nextName = locationName.trim();

    if (!nextName) {
      setLocationError('Ingrese el nombre del barrio.');
      return;
    }

    const isDuplicate = locations.some((loc) => loc.toLowerCase() === nextName.toLowerCase() && loc !== editingLocation);
    if (isDuplicate) {
      setLocationError('Ese barrio ya existe.');
      return;
    }

    if (editingLocation) {
      const nextLocations = locations.map((loc) => loc === editingLocation ? nextName : loc);
      const nextProperties = properties.map((property) => (
        property.location === editingLocation ? { ...property, location: nextName } : property
      ));

      setLocations(nextLocations);
      setProperties(nextProperties);
      await saveLocations(nextLocations);
      await saveProperties(nextProperties);
    } else {
      const nextLocations = [...locations, nextName];
      setLocations(nextLocations);
      await saveLocations(nextLocations);
    }

    setLocationName('');
    setEditingLocation(null);
    setLocationError('');
  };

  const startEditLocation = (location) => {
    setEditingLocation(location);
    setLocationName(location);
    setLocationError('');
  };

  const cancelEditLocation = () => {
    setEditingLocation(null);
    setLocationName('');
    setLocationError('');
  };

  const handleDeleteLocation = async (location) => {
    const hasProperties = properties.some((property) => property.location === location);
    if (hasProperties) {
      window.alert('No se puede eliminar un barrio que tiene propiedades cargadas. Primero cambie esas propiedades a otro barrio.');
      return;
    }

    if (window.confirm(`¿Eliminar el barrio "${location}"?`)) {
      const nextLocations = locations.filter((loc) => loc !== location);
      setLocations(nextLocations);
      await saveLocations(nextLocations);
    }
  };

  const handleTypeSubmit = async (e) => {
    e.preventDefault();
    const nextName = typeName.trim();

    if (!nextName) {
      setTypeError('Ingrese el nombre de la tipología.');
      return;
    }

    const isDuplicate = types.some((type) => type.toLowerCase() === nextName.toLowerCase() && type !== editingType);
    if (isDuplicate) {
      setTypeError('Esa tipología ya existe.');
      return;
    }

    if (editingType) {
      const nextTypes = types.map((type) => type === editingType ? nextName : type);
      const nextProperties = properties.map((property) => (
        property.type === editingType ? { ...property, type: nextName } : property
      ));

      setTypes(nextTypes);
      setProperties(nextProperties);
      await saveTypes(nextTypes);
      await saveProperties(nextProperties);
    } else {
      const nextTypes = [...types, nextName];
      setTypes(nextTypes);
      await saveTypes(nextTypes);
    }

    setTypeName('');
    setEditingType(null);
    setTypeError('');
  };

  const startEditType = (type) => {
    setEditingType(type);
    setTypeName(type);
    setTypeError('');
  };

  const cancelEditType = () => {
    setEditingType(null);
    setTypeName('');
    setTypeError('');
  };

  const handleDeleteType = async (type) => {
    const hasProperties = properties.some((property) => property.type === type);
    if (hasProperties) {
      window.alert('No se puede eliminar una tipología que tiene propiedades cargadas. Primero cambie esas propiedades a otra tipología.');
      return;
    }

    if (window.confirm(`¿Eliminar la tipología "${type}"?`)) {
      const nextTypes = types.filter((item) => item !== type);
      setTypes(nextTypes);
      await saveTypes(nextTypes);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.loginOverlay}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <div className={styles.iconCircle}>
              <Lock size={24} />
            </div>
            <h2>Acceso Administración</h2>
            <p>Ingresá la clave de Vergnano Administraciones para gestionar las propiedades.</p>
          </div>
          
          <form onSubmit={handleLoginSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="admin-pass">Contraseña Administrativa</label>
              <input 
                type="password" 
                id="admin-pass" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                className={styles.loginInput}
              />
              {loginError && <span className={styles.loginErrorText}>{loginError}</span>}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Ingresar al Panel
            </button>
          </form>

          <div className={styles.recoveryBox}>
            <button type="button" onClick={handleSendRecoveryEmail} className={styles.backToSiteBtn}>
              Enviar código por mail
            </button>
            {resetMessage && <p className={styles.recoveryText}>{resetMessage}</p>}
            <form onSubmit={handleResetLogin} className={styles.loginForm}>
              <div className={styles.formGroup}>
                <label htmlFor="reset-code">Código recibido</label>
                <input
                  type="text"
                  id="reset-code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="Código temporal"
                  className={styles.loginInput}
                />
              </div>
              <button type="submit" className="btn btn-outline" style={{ width: '100%' }}>
                Ingresar con Código
              </button>
            </form>
          </div>
          
          <button onClick={onBackToSite} className={styles.backToSiteBtn}>
            Volver a la Web Principal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      
      {/* Admin Navbar */}
      <header className={styles.adminNav}>
        <div className={styles.navLeft}>
          <div className={styles.adminLogoIcon}>
            <Building size={20} />
          </div>
          <div>
            <h1 className={styles.navTitle}>Vergnano Panel</h1>
            <span className={styles.navSubtitle}>Administración Inmobiliaria</span>
          </div>
        </div>
        
        <div className={styles.navRight}>
          <button onClick={onBackToSite} className={`btn btn-outline ${styles.viewSiteBtn}`}>
            <ExternalLink size={16} />
            Ver Web Pública
          </button>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </header>

      {/* Admin Dashboard Body */}
      <main className={styles.adminMain}>
        
        {/* Statistics Panels */}
        <section className={styles.statsSection}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ backgroundColor: 'var(--primary-red-light)', color: 'var(--primary-red)' }}>
              <Building size={24} />
            </div>
            <div className={styles.statDetails}>
              <span className={styles.statVal}>{totalProperties}</span>
              <span className={styles.statLbl}>Listados Activos</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ backgroundColor: 'var(--accent-yellow-light)', color: 'var(--accent-yellow-hover)' }}>
              <Coins size={24} />
            </div>
            <div className={styles.statDetails}>
              <span className={styles.statVal}>{formatCurrency(avgPrice)}</span>
              <span className={styles.statLbl}>Alquiler Promedio</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
              <TrendingUp size={24} />
            </div>
            <div className={styles.statDetails}>
              <span className={styles.statVal}>{formatCurrency(maxPrice)}</span>
              <span className={styles.statLbl}>Alquiler Máximo</span>
            </div>
          </div>
        </section>

        <div className={styles.adminTabs}>
          <button
            type="button"
            onClick={() => setActiveTab('properties')}
            className={`${styles.adminTabBtn} ${activeTab === 'properties' ? styles.adminTabActive : ''}`}
          >
            Propiedades
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`${styles.adminTabBtn} ${activeTab === 'content' ? styles.adminTabActive : ''}`}
          >
            Contenido de la Web
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lists')}
            className={`${styles.adminTabBtn} ${activeTab === 'lists' ? styles.adminTabActive : ''}`}
          >
            Barrios y Tipologías
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`${styles.adminTabBtn} ${activeTab === 'security' ? styles.adminTabActive : ''}`}
          >
            Seguridad
          </button>
        </div>

        {activeTab === 'security' && (
        <section className={styles.tableSection}>
          <div className={styles.tableHeaderArea}>
            <div>
              <h2 className={styles.tableAreaTitle}>Seguridad del Panel</h2>
              <p className={styles.sectionHint}>Cambie la contraseña del administrador usando la clave actual o un código de recuperación.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className={styles.contentForm}>
            <div className={styles.contentSectionGroup}>
              <h3 className={styles.contentGroupTitle}>Cambiar Contraseña</h3>
              <div className={styles.contentFieldsGrid}>
                <div className={styles.formGroup}>
                  <label>Contraseña actual</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={securityForm.currentPassword}
                    onChange={handleSecurityChange}
                    className={styles.modalInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Código de recuperación</label>
                  <input
                    type="text"
                    name="recoveryCode"
                    value={securityForm.recoveryCode}
                    onChange={handleSecurityChange}
                    placeholder="Opcional si no tiene la contraseña actual"
                    className={styles.modalInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Nueva contraseña</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={securityForm.newPassword}
                    onChange={handleSecurityChange}
                    className={styles.modalInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Repetir nueva contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={securityForm.confirmPassword}
                    onChange={handleSecurityChange}
                    className={styles.modalInput}
                  />
                </div>
              </div>
              {securityError && <span className={styles.formErrorText}>{securityError}</span>}
              {securityMessage && <span className={styles.savedPill}>{securityMessage}</span>}
            </div>

            <div className={styles.contentFormFooter}>
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                Guardar Nueva Contraseña
              </button>
            </div>
          </form>
        </section>
        )}

        {activeTab === 'content' && (
        <section className={styles.tableSection}>
          <div className={styles.tableHeaderArea}>
            <div>
              <h2 className={styles.tableAreaTitle}>Contenido de la Web</h2>
              <p className={styles.sectionHint}>Modifica textos, datos de contacto, WhatsApp, redes y mapa de Google.</p>
            </div>
            {contentSaved && <span className={styles.savedPill}>Guardado</span>}
          </div>

          <form onSubmit={handleContentSubmit} className={styles.contentForm}>
            <div className={styles.contentSectionGroup}>
              <h3 className={styles.contentGroupTitle}>Logo de la Inmobiliaria</h3>
              <div className={styles.logoUploadRow}>
                <div className={styles.logoPreviewBox}>
                  {contentForm.logoImage ? (
                    <img src={contentForm.logoImage} alt="Logo de la inmobiliaria" className={styles.logoPreviewImg} />
                  ) : (
                    <Building size={28} />
                  )}
                </div>
                <div className={styles.logoUploadControls}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    className={styles.fileInput}
                  />
                  <small style={{ color: 'var(--text-light)', fontSize: '11px' }}>
                    Se mostrará en el encabezado y el footer. Recomendado: logo cuadrado o horizontal con buena lectura.
                  </small>
                  {contentForm.logoImage && (
                    <button type="button" onClick={clearLogo} className={styles.deleteBtn} style={{ width: 'fit-content' }}>
                      Quitar Logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {contentSections.map((section) => (
              <div key={section.title} className={styles.contentSectionGroup}>
                <h3 className={styles.contentGroupTitle}>{section.title}</h3>
                <div className={styles.contentFieldsGrid}>
                  {section.fields.map(([name, label, type]) => (
                    <div key={name} className={styles.formGroup}>
                      <label>{label}</label>
                      {type === 'textarea' ? (
                        <textarea
                          name={name}
                          rows="3"
                          value={contentForm[name] || ''}
                          onChange={handleContentChange}
                          className={styles.modalTextarea}
                        ></textarea>
                      ) : (
                        <input
                          type="text"
                          name={name}
                          value={contentForm[name] || ''}
                          onChange={handleContentChange}
                          className={styles.modalInput}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className={styles.contentFormFooter}>
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                Guardar Contenido
              </button>
            </div>
          </form>
        </section>
        )}

        {activeTab === 'lists' && (
        <>
        <section className={styles.tableSection}>
          <div className={styles.tableHeaderArea}>
            <div>
              <h2 className={styles.tableAreaTitle}>Administración de Barrios</h2>
              <p className={styles.sectionHint}>Estos barrios aparecen en el buscador, filtros y formulario de propiedades.</p>
            </div>
          </div>

          <form onSubmit={handleLocationSubmit} className={styles.locationForm}>
            <div className={styles.formGroup}>
              <label>{editingLocation ? 'Modificar barrio' : 'Nuevo barrio'}</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Ej. Villa Belgrano"
                className={`${styles.modalInput} ${locationError ? styles.errorBorder : ''}`}
              />
              {locationError && <span className={styles.formErrorText}>{locationError}</span>}
            </div>

            <button type="submit" className={`btn btn-primary ${styles.addBtn}`}>
              <Plus size={16} />
              {editingLocation ? 'Guardar Barrio' : 'Agregar Barrio'}
            </button>
            {editingLocation && (
              <button type="button" onClick={cancelEditLocation} className="btn btn-outline" style={{ padding: '10px 20px' }}>
                Cancelar
              </button>
            )}
          </form>

          <div className={styles.locationList}>
            {locations.map((location) => (
              <div key={location} className={styles.locationItem}>
                <span className={styles.locationName}>{location}</span>
                <div className={styles.actionButtonsRow}>
                  <button onClick={() => startEditLocation(location)} className={styles.editBtn} title="Editar barrio">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => handleDeleteLocation(location)} className={styles.deleteBtn} title="Eliminar barrio">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.tableSection}>
          <div className={styles.tableHeaderArea}>
            <div>
              <h2 className={styles.tableAreaTitle}>Administración de Tipologías</h2>
              <p className={styles.sectionHint}>Estas opciones aparecen en Dormitorios del buscador, filtros y formulario de propiedades.</p>
            </div>
          </div>

          <form onSubmit={handleTypeSubmit} className={styles.locationForm}>
            <div className={styles.formGroup}>
              <label>{editingType ? 'Modificar tipología' : 'Nueva tipología'}</label>
              <input
                type="text"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                placeholder="Ej. 4 Dormitorios"
                className={`${styles.modalInput} ${typeError ? styles.errorBorder : ''}`}
              />
              {typeError && <span className={styles.formErrorText}>{typeError}</span>}
            </div>

            <button type="submit" className={`btn btn-primary ${styles.addBtn}`}>
              <Plus size={16} />
              {editingType ? 'Guardar Tipología' : 'Agregar Tipología'}
            </button>
            {editingType && (
              <button type="button" onClick={cancelEditType} className="btn btn-outline" style={{ padding: '10px 20px' }}>
                Cancelar
              </button>
            )}
          </form>

          <div className={styles.locationList}>
            {types.map((type) => (
              <div key={type} className={styles.locationItem}>
                <span className={styles.locationName}>{type}</span>
                <div className={styles.actionButtonsRow}>
                  <button onClick={() => startEditType(type)} className={styles.editBtn} title="Editar tipología">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => handleDeleteType(type)} className={styles.deleteBtn} title="Eliminar tipología">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        </>
        )}

        {/* Catalog Manager Table */}
        {activeTab === 'properties' && (
        <section className={styles.tableSection}>
          <div className={styles.tableHeaderArea}>
            <h2 className={styles.tableAreaTitle}>Administración de Catálogo</h2>
            <button onClick={openAddModal} className={`btn btn-primary ${styles.addBtn}`}>
              <Plus size={16} />
              Cargar Propiedad
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Propiedad / Dirección</th>
                  <th>Barrio</th>
                  <th>Alquiler</th>
                  <th>Expensas</th>
                  <th>Medidas</th>
                  <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <img src={p.images[0]} alt={p.title} className={styles.tableThumbnail} />
                    </td>
                    <td>
                      <div className={styles.tableTitleCell}>
                        <span className={styles.tablePropName}>{p.title}</span>
                        <span className={styles.tablePropAddr}>{p.address}</span>
                      </div>
                    </td>
                    <td><span className={styles.tableLocation}>{p.location}</span></td>
                    <td><strong className={styles.tablePrice}>{formatCurrency(p.price)}</strong></td>
                    <td><span className={styles.tableExpenses}>{formatCurrency(p.expenses)}</span></td>
                    <td>
                      <span className={styles.tableSpecs}>
                        {p.surface} m² | {p.bedrooms === 0 ? 'Mono.' : `${p.bedrooms} Dorm`}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtonsRow}>
                        <button onClick={() => openEditModal(p)} className={styles.editBtn} title="Editar">
                          <Edit3 size={15} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className={styles.deleteBtn} title="Eliminar">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {properties.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No hay departamentos en la base de datos local. Hace clic en "Cargar Propiedad" para dar de alta uno nuevo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        )}

      </main>

      {/* Edit / Create Form Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{editingProperty ? 'Editar Departamento' : 'Cargar Nuevo Departamento'}</h3>
              <button onClick={() => setIsModalOpen(false)} className={styles.modalCloseBtn}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className={styles.modalForm}>
              <div className={styles.modalScrollBody}>
                
                <div className={styles.formGroup}>
                  <label>Título del Listado *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ej. Departamento de 1 Dormitorio con Asador"
                    className={`${styles.modalInput} ${formErrors.title ? styles.errorBorder : ''}`}
                  />
                  {formErrors.title && <span className={styles.formErrorText}>{formErrors.title}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label>Link de Google Maps (opcional)</label>
                  <input
                    type="text"
                    name="mapUrl"
                    value={formData.mapUrl}
                    onChange={handleInputChange}
                    placeholder="Pegá un link de Google Maps o dejalo vacío para usar la dirección"
                    className={styles.modalInput}
                  />
                  <small style={{ color: 'var(--text-light)', fontSize: '11px', marginTop: '2px' }}>
                    Acepta enlaces normales o largos de Google Maps. Si queda vacío, el mapa se genera con la dirección física y el barrio.
                  </small>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Barrio / Zona *</label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={styles.modalSelect}
                    >
                      {locations.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                      <option value="Otro">Otro barrio...</option>
                    </select>
                  </div>
                  
                  {formData.location === 'Otro' && (
                    <div className={styles.formGroup}>
                      <label>Nombre del Barrio *</label>
                      <input
                        type="text"
                        name="customLocation"
                        value={formData.customLocation}
                        onChange={handleInputChange}
                        placeholder="Ej. Villa Belgrano"
                        className={`${styles.modalInput} ${formErrors.customLocation ? styles.errorBorder : ''}`}
                      />
                      {formErrors.customLocation && <span className={styles.formErrorText}>{formErrors.customLocation}</span>}
                    </div>
                  )}

                  <div className={styles.formGroup}>
                    <label>Dirección Física *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Ej. Av. Colón 1200, 4B"
                      className={`${styles.modalInput} ${formErrors.address ? styles.errorBorder : ''}`}
                    />
                    {formErrors.address && <span className={styles.formErrorText}>{formErrors.address}</span>}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Precio Mensual (ARS) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Ej. 350000"
                      className={`${styles.modalInput} ${formErrors.price ? styles.errorBorder : ''}`}
                      min="0"
                    />
                    {formErrors.price && <span className={styles.formErrorText}>{formErrors.price}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Expensas (ARS) *</label>
                    <input
                      type="number"
                      name="expenses"
                      value={formData.expenses}
                      onChange={handleInputChange}
                      placeholder="Ej. 40000"
                      className={`${styles.modalInput} ${formErrors.expenses ? styles.errorBorder : ''}`}
                      min="0"
                    />
                    {formErrors.expenses && <span className={styles.formErrorText}>{formErrors.expenses}</span>}
                  </div>
                </div>

                <div className={styles.formRowThree}>
                  <div className={styles.formGroup}>
                    <label>Dormitorios *</label>
                    <select
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      className={styles.modalSelect}
                    >
                      <option value="0">Monoambiente</option>
                      <option value="1">1 Dormitorio</option>
                      <option value="2">2 Dormitorios</option>
                      <option value="3">3 Dormitorios</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Baños *</label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      className={styles.modalInput}
                      min="1"
                      step="0.5"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Superficie (m²) *</label>
                    <input
                      type="number"
                      name="surface"
                      value={formData.surface}
                      onChange={handleInputChange}
                      placeholder="Ej. 45"
                      className={`${styles.modalInput} ${formErrors.surface ? styles.errorBorder : ''}`}
                      min="0"
                    />
                    {formErrors.surface && <span className={styles.formErrorText}>{formErrors.surface}</span>}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Tipología Listado *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={styles.modalSelect}
                  >
                    {types.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Descripción General *</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detalles sobre el departamento..."
                    className={`${styles.modalTextarea} ${formErrors.description ? styles.errorBorder : ''}`}
                  ></textarea>
                  {formErrors.description && <span className={styles.formErrorText}>{formErrors.description}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label>Comodidades (Separadas por comas)</label>
                  <input
                    type="text"
                    name="amenitiesStr"
                    value={formData.amenitiesStr}
                    onChange={handleInputChange}
                    placeholder="Ej. Balcón, Aire acondicionado, Cochera, Asador"
                    className={styles.modalInput}
                  />
                  <small style={{ color: 'var(--text-light)', fontSize: '11px', marginTop: '2px' }}>
                    Escribe cada comodidad separada por una coma (,) para listarlas por separado.
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label>Galería de Imágenes</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageFileChange}
                    className={styles.fileInput}
                  />
                  <small style={{ color: 'var(--text-light)', fontSize: '11px', marginTop: '2px' }}>
                    Puede cargar varias fotos desde la computadora. También puede agregar URLs manualmente debajo.
                  </small>

                  <div className={styles.imagePreviewGrid}>
                    {formData.images.map((image, index) => (
                      <div key={`${image}-${index}`} className={styles.imageSlot}>
                        {image ? (
                          <img src={image} alt={`Foto ${index + 1}`} className={styles.imagePreview} />
                        ) : (
                          <span className={styles.emptyImageSlot}>Foto {index + 1}</span>
                        )}
                        <button type="button" onClick={() => clearImage(index)} className={styles.removeImageBtn}>
                          Quitar
                        </button>
                      </div>
                    ))}
                    {formData.images.length === 0 && (
                      <div className={styles.imageSlot}>
                        <span className={styles.emptyImageSlot}>Sin fotos</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {formData.images.map((image, index) => (
                      <div key={`url-${index}`} className={styles.imageUrlRow}>
                        <input
                          type="text"
                          value={image}
                          onChange={(e) => updateImageUrl(index, e.target.value)}
                          placeholder={`URL Foto ${index + 1}`}
                          className={styles.modalInput}
                        />
                        <button type="button" onClick={() => clearImage(index)} className={styles.deleteBtn} title="Eliminar foto">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={addImageUrl} className="btn btn-outline" style={{ width: 'fit-content', padding: '10px 16px' }}>
                      <Plus size={16} />
                      Agregar URL de Foto
                    </button>
                  </div>
                </div>

              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline" style={{ padding: '10px 20px' }}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                  {editingProperty ? 'Guardar Cambios' : 'Crear Propiedad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
