import { hasSupabaseConfig, supabase } from './supabaseClient';

export const propertiesData = [
  {
    id: 1,
    title: "Monoambiente Luminoso con Balcón Al Frente",
    type: "Monoambiente",
    price: 320000,
    expenses: 35000,
    location: "Nueva Córdoba",
    address: "Rondeau 450",
    bedrooms: 0,
    bathrooms: 1,
    surface: 32,
    operation: "Alquiler",
    description: "Excelente departamento monoambiente ubicado en el corazón de Nueva Córdoba. Muy luminoso, con ventilación cruzada y balcón hacia la calle. Cocina integrada con bajo mesada y alacena, baño completo con bañera y placard con interiores listos.",
    amenities: ["Balcón al frente", "Aire acondicionado", "Bajo mesada y alacena", "Placard con interiores", "Termotanque eléctrico"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 2,
    title: "Departamento de 1 Dormitorio con Terraza",
    type: "1 Dormitorio",
    price: 410000,
    expenses: 45000,
    location: "General Paz",
    address: "25 de Mayo 1200",
    bedrooms: 1,
    bathrooms: 1,
    surface: 48,
    operation: "Alquiler",
    description: "Moderno departamento de un dormitorio ubicado en Barrio General Paz. Cuenta con un amplio estar comedor, cocina semi-integrada con barra desayunadora, dormitorio con vestidor y salida a un gran balcón terraza de uso exclusivo. El edificio cuenta con terraza de uso común, piscina y asadores.",
    amenities: ["Balcón terraza", "Piscina en terraza", "Asador en edificio", "Vestidor", "Barra desayunadora"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 3,
    title: "Semipiso de 2 Dormitorios con Cochera",
    type: "2 Dormitorios",
    price: 650000,
    expenses: 75000,
    location: "Cerro de las Rosas",
    address: "Av. Rafael Núñez 3800",
    bedrooms: 2,
    bathrooms: 2,
    surface: 85,
    operation: "Alquiler",
    description: "Exclusivo semipiso en zona residencial del Cerro de las Rosas. Posee un amplio living comedor con pisos de parquet, cocina separada totalmente equipada con ventilación natural, dos baños (uno en suite con hidromasaje) y balcón con asador propio. Incluye cochera subterránea con portón automático.",
    amenities: ["Cochera subterránea", "Asador propio en balcón", "Seguridad 24 hs", "Calefacción por radiadores", "Suite con hidromasaje", "Pisos de parquet"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 4,
    title: "Departamento Familiar de 3 Dormitorios",
    type: "3 Dormitorios",
    price: 780000,
    expenses: 95000,
    location: "Centro",
    address: "Av. Colón 800",
    bedrooms: 3,
    bathrooms: 2.5,
    surface: 110,
    operation: "Alquiler",
    description: "Espacioso departamento ideal para familias, ubicado en pleno centro con excelente conectividad. Dispone de un enorme living comedor con ventanales de pared a pared, cocina comedor diario independiente, tres dormitorios con amplios placards, dos baños principales y toilette. Entrada de servicio e instalación para lavarropas.",
    amenities: ["Doble ingreso", "Calefacción central", "Lavadero independiente", "Dependencia de servicio", "Baño social", "Seguridad nocturna"],
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 5,
    title: "Monoambiente Moderno y Funcional",
    type: "Monoambiente",
    price: 290000,
    expenses: 30000,
    location: "Alberdi",
    address: "Av. Colón 1900",
    bedrooms: 0,
    bathrooms: 1,
    surface: 35,
    operation: "Alquiler",
    description: "Departamento monoambiente moderno e impecable. Ideal para estudiantes o profesionales. Ubicado a pocas cuadras de zona universitaria y centros médicos. Cuenta con división virtual por placard, cocina equipada con anafe eléctrico y extractor, baño amplio y balcón interno silencioso y seguro.",
    amenities: ["Bajas expensas", "Anafe y extractor instalados", "Cercano a universidades", "Cortinas black-out incluidas", "Agua caliente central"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 6,
    title: "Departamento Amplio de 2 Dormitorios al Frente",
    type: "2 Dormitorios",
    price: 550000,
    expenses: 62000,
    location: "Nueva Córdoba",
    address: "Chacabuco 850",
    bedrooms: 2,
    bathrooms: 1.5,
    surface: 70,
    operation: "Alquiler",
    description: "Excelente departamento de 2 dormitorios en Nueva Córdoba sobre una de las avenidas más importantes de la zona. Living comedor luminoso con salida al balcón corrido, cocina semi-separada con excelente mobiliario, dormitorios con amplios placards e interiores, un baño completo con antebaño y un toilette de recepción.",
    amenities: ["Balcón corrido", "Antebaño", "Toilette de recepción", "Excelente ventilación", "Cámaras de seguridad en edificio"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
    ]
  }
];

export const defaultLocations = ["Nueva Córdoba", "General Paz", "Cerro de las Rosas", "Centro", "Alberdi"];
export const locationsList = ["Todos", ...defaultLocations];
export const defaultTypes = ["Monoambiente", "1 Dormitorio", "2 Dormitorios", "3 Dormitorios"];
export const typesList = ["Todos", ...defaultTypes];

// LocalStorage helpers for Admin CRUD
const STORAGE_KEY = 'vergnano_properties';
const LOCATIONS_STORAGE_KEY = 'vergnano_locations';
const TYPES_STORAGE_KEY = 'vergnano_types';

function getLocalData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading localStorage, returning defaults", e);
    return fallback;
  }
}

function saveLocalData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error("Error writing to localStorage", e);
    return false;
  }
}

async function getSettingsValue(key, fallback) {
  if (!hasSupabaseConfig) return getLocalData(key, fallback);

  const { data, error } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();

  if (error) {
    console.error(`Error reading ${key} from Supabase`, error);
    return getLocalData(key, fallback);
  }

  if (!data) {
    await saveSettingsValue(key, fallback);
    return fallback;
  }

  return data.value;
}

async function saveSettingsValue(key, value) {
  if (!hasSupabaseConfig) return saveLocalData(key, value);

  const { error } = await supabase
    .from('app_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) {
    console.error(`Error writing ${key} to Supabase`, error);
    return saveLocalData(key, value);
  }

  return true;
}

export async function getStoredProperties() {
  if (!hasSupabaseConfig) return getLocalData(STORAGE_KEY, propertiesData);

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error("Error reading properties from Supabase", error);
    return getLocalData(STORAGE_KEY, propertiesData);
  }

  if (!data || data.length === 0) {
    await saveProperties(propertiesData);
    return propertiesData;
  }

  return data.map((property) => ({
    id: property.id,
    title: property.title,
    type: property.type,
    price: property.price,
    expenses: property.expenses,
    location: property.location,
    address: property.address,
    mapUrl: property.map_url || '',
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    surface: property.surface,
    operation: property.operation,
    description: property.description,
    amenities: property.amenities || [],
    images: property.images || []
  }));
}

export async function saveProperties(properties) {
  if (!hasSupabaseConfig) return saveLocalData(STORAGE_KEY, properties);

  const rows = properties.map((property, index) => ({
    id: property.id,
    title: property.title,
    type: property.type,
    price: property.price,
    expenses: property.expenses,
    location: property.location,
    address: property.address,
    map_url: property.mapUrl || '',
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    surface: property.surface,
    operation: property.operation,
    description: property.description,
    amenities: property.amenities || [],
    images: property.images || [],
    sort_order: index,
    updated_at: new Date().toISOString()
  }));

  const { error: deleteError } = await supabase.from('properties').delete().neq('id', -1);
  if (deleteError) {
    console.error("Error clearing Supabase properties", deleteError);
    return saveLocalData(STORAGE_KEY, properties);
  }

  if (rows.length === 0) return true;

  const { error } = await supabase.from('properties').insert(rows);
  if (error) {
    console.error("Error writing properties to Supabase", error);
    return saveLocalData(STORAGE_KEY, properties);
  }

  return true;
}

export async function getStoredLocations() {
  return getSettingsValue(LOCATIONS_STORAGE_KEY, defaultLocations);
}

export async function saveLocations(locations) {
  return saveSettingsValue(LOCATIONS_STORAGE_KEY, locations);
}

export async function getStoredTypes() {
  return getSettingsValue(TYPES_STORAGE_KEY, defaultTypes);
}

export async function saveTypes(types) {
  return saveSettingsValue(TYPES_STORAGE_KEY, types);
}
