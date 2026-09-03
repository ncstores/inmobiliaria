import { hasSupabaseConfig, supabase } from './supabaseClient';

export const defaultSiteContent = {
  brandName: 'VERGNANO',
  brandSubtitle: 'Administraciones',
  logoImage: '',
  heroBackgroundImage: '',
  heroOverlayOpacity: '45',
  headerCtaText: 'Llamar Ahora',
  heroBadge: 'CONFIANZA Y TRAYECTORIA',
  heroTitle: 'Administración Profesional de Consorcios y Alquileres',
  heroSubtitle: 'En Vergnano Administraciones gestionamos tu consorcio con transparencia y te ayudamos a encontrar tu departamento ideal en las mejores zonas de la ciudad.',
  heroStat1Number: '15+',
  heroStat1Label: 'Años de Experiencia',
  heroStat2Number: '80+',
  heroStat2Label: 'Edificios Administrados',
  heroStat3Number: '100%',
  heroStat3Label: 'Clientes Satisfechos',
  catalogBadge: 'CATÁLOGO',
  catalogTitle: 'Departamentos en Alquiler',
  catalogSubtitle: 'Explorá nuestra selección de departamentos residenciales disponibles. Ofrecemos contratos transparentes y gestión directa.',
  servicesBadge: '¿QUÉ HACEMOS?',
  servicesTitle: 'Servicios Profesionales a tu Medida',
  servicesSubtitle: 'Brindamos soluciones integrales en administración y corretaje inmobiliario, priorizando la transparencia y la comunicación constante.',
  service1Title: 'Administración de Consorcios',
  service1Description: 'Liquidación mensual de expensas transparente, rendición de cuentas anual y gestión ágil de asambleas. Optimizamos los gastos del edificio de forma responsable.',
  service2Title: 'Gestión Integral de Alquileres',
  service2Description: 'Coordinación de contratos, cobro mensual de alquileres, seguimiento de servicios y verificación estricta de garantías para asegurar tu tranquilidad.',
  service3Title: 'Mantenimiento y Urgencias 24/7',
  service3Description: 'Atención inmediata de inconvenientes edilicios y reparaciones preventivas a través de nuestro equipo calificado de plomeros, electricistas y gasistas de confianza.',
  service4Title: 'Asesoramiento Legal y Técnico',
  service4Description: 'Respaldo jurídico en contratos inmobiliarios y normativas de consorcio. Control de estados edilicios mediante inspecciones periódicas reglamentarias.',
  aboutBadge: 'SOBRE NOSOTROS',
  aboutTitle: 'Vergnano Administraciones',
  aboutLead: 'Somos una empresa familiar dedicada a la administración de consorcios y la gestión de propiedades en la provincia de Córdoba.',
  aboutDescription: 'Desde nuestros inicios, nuestro propósito ha sido profesionalizar la administración edilicia a través de procesos claros, digitalización de expensas y una red de mantenimiento que responde al instante. Nos caracteriza la seriedad, la presencia activa en los edificios y el diálogo constante con los consejos de propietarios.',
  aboutExperienceNumber: '15+',
  aboutExperienceText: 'Años en el Mercado Inmobiliario',
  value1Title: 'Transparencia Absoluta',
  value1Description: 'Cuentas claras y sin sorpresas. Proporcionamos toda la documentación de respaldo digitalizada para consulta de los copropietarios.',
  value2Title: 'Compromiso y Confianza',
  value2Description: 'Construimos relaciones de largo plazo basadas en la honestidad. Nos ocupamos de tu patrimonio como si fuera propio.',
  value3Title: 'Cercanía y Calidez',
  value3Description: 'Atención personalizada y humana. Respondemos tus consultas y llamadas de forma directa, sin bots ni intermediarios.',
  contactBadge: 'CONTACTO',
  contactTitle: '¿Tenés alguna consulta?',
  contactSubtitle: 'Estamos a tu disposición para responder dudas sobre departamentos disponibles, administración de expensas o el estado de tu consorcio.',
  contactAddressLabel: 'Dirección de la Oficina',
  contactAddress: 'Av. Chacabuco 600, 2° Piso, Nueva Córdoba',
  contactPhoneLabel: 'Teléfono Fijo / Celular',
  contactPhone: '+54 351 425-6789 / +54 9 351 234-5678',
  contactPhoneHref: '+543514256789',
  contactEmailLabel: 'Correo Electrónico',
  contactEmail: 'contacto@vergnanoadm.com.ar',
  contactHoursLabel: 'Horarios de Atención',
  contactHours: 'Lunes a Viernes de 9:00 a 17:00 hs',
  whatsappNumber: '5493512345678',
  webmailUrl: 'https://webmail.administracionesvergnano.com.ar',
  googleMapsUrl: 'https://maps.google.com/maps?q=Av.%20Chacabuco%20600,%20Cordoba,%20Argentina&t=&z=16&ie=UTF8&iwloc=&output=embed',
  footerMotto: 'Administración responsable de consorcios y corretaje inmobiliario. Honestidad, eficiencia y cercanía a tu servicio.',
  footerEmergencyTitle: 'Urgencias Copropietarios',
  footerEmergencyText: 'Si sos inquilino o propietario de un consorcio administrado por nosotros y tenés una urgencia edilicia (gas, agua, cerrajería):',
  footerWhatsappText: 'Guardia WhatsApp',
  footerPhoneText: 'Llamar Guardia',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  linkedinUrl: 'https://linkedin.com'
};

const STORAGE_KEY = 'vergnano_site_content';

export async function getStoredSiteContent() {
  if (hasSupabaseConfig) {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', STORAGE_KEY)
      .maybeSingle();

    if (error) {
      console.error('Error reading site content from Supabase, using local fallback', error);
    } else if (data) {
      return { ...defaultSiteContent, ...data.value };
    } else {
      await saveSiteContent(defaultSiteContent);
      return defaultSiteContent;
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSiteContent));
      return defaultSiteContent;
    }

    return { ...defaultSiteContent, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error reading site content from localStorage, returning defaults', e);
    return defaultSiteContent;
  }
}

export async function saveSiteContent(content) {
  if (hasSupabaseConfig) {
    const { error } = await supabase
      .from('app_settings')
      .upsert({ key: STORAGE_KEY, value: content, updated_at: new Date().toISOString() });

    if (!error) return true;

    console.error('Error writing site content to Supabase, using local fallback', error);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    return true;
  } catch (e) {
    console.error('Error writing site content to localStorage', e);
    return false;
  }
}
