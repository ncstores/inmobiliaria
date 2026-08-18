import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle } from 'lucide-react';
import styles from './Contact.module.css';

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

  const isGoogleMapsUrl = trimmedUrl.includes('google.com/maps') || trimmedUrl.includes('maps.app.goo.gl');
  const query = isGoogleMapsUrl ? fallbackQuery : encodeURIComponent(trimmedUrl);
  return `https://maps.google.com/maps?q=${query}&z=16&output=embed`;
}

export default function Contact({ content }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Alquileres',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const mapEmbedUrl = getGoogleMapsEmbedUrl(content.googleMapsUrl, content.contactAddress);

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "El nombre es obligatorio.";
    if (!formData.email.trim()) {
      tempErrors.email = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "El formato de correo no es válido.";
    }
    if (!formData.message.trim()) tempErrors.message = "El mensaje no puede estar vacío.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      
      // Mock API call delay
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'Alquileres',
          message: ''
        });
        
        // Hide success banner after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      }, 1500);
    }
  };

  return (
    <section id="contacto" className={`section ${styles.contactSection}`}>
      <div className="container">
        
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <span className="badge badge-red">{content.contactBadge}</span>
          <h2 className={styles.sectionTitle}>{content.contactTitle}</h2>
          <p className={styles.sectionSubtitle}>
            {content.contactSubtitle}
          </p>
        </div>

        <div className={styles.grid}>
          
          {/* Form Column */}
          <div className={styles.formColumn}>
            {submitSuccess && (
              <div className={styles.successBanner}>
                <CheckCircle size={20} className={styles.successIcon} />
                <div className={styles.successContent}>
                  <h4 className={styles.successTitle}>¡Mensaje enviado con éxito!</h4>
                  <p className={styles.successText}>Nos comunicaremos con vos a la brevedad.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>Nombre Completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    placeholder="Ej. Juan Pérez"
                  />
                  {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>Teléfono de Contacto</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Ej. 3512345678"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>Correo Electrónico *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    placeholder="juan@correo.com"
                  />
                  {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.label}>Motivo de Consulta</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="Alquileres">Alquiler de Departamentos</option>
                    <option value="Administración">Administración de Consorcios</option>
                    <option value="Mantenimiento">Reclamos / Mantenimiento</option>
                    <option value="Otros">Otras consultas</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>Tu Mensaje *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                  placeholder="Escribí tu consulta aquí..."
                ></textarea>
                {errors.message && <span className={styles.errorMessage}>{errors.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn btn-primary ${styles.submitBtn}`}
              >
                {isSubmitting ? 'Enviando...' : (
                  <>
                    <Send size={16} />
                    Enviar Mensaje
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info & Map Column */}
          <div className={styles.infoColumn}>
            
            {/* Contact Details Card */}
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Datos de Contacto</h3>
              
              <div className={styles.infoItemsList}>
                <div className={styles.infoItem}>
                  <MapPin size={20} className={styles.infoIcon} />
                  <div>
                    <h5 className={styles.infoLabel}>{content.contactAddressLabel}</h5>
                    <p className={styles.infoValue}>{content.contactAddress}</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <Phone size={20} className={styles.infoIcon} />
                  <div>
                    <h5 className={styles.infoLabel}>{content.contactPhoneLabel}</h5>
                    <p className={styles.infoValue}>{content.contactPhone}</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <Mail size={20} className={styles.infoIcon} />
                  <div>
                    <h5 className={styles.infoLabel}>{content.contactEmailLabel}</h5>
                    <p className={styles.infoValue}>{content.contactEmail}</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <Clock size={20} className={styles.infoIcon} />
                  <div>
                    <h5 className={styles.infoLabel}>{content.contactHoursLabel}</h5>
                    <p className={styles.infoValue}>{content.contactHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Mock container */}
            <div className={styles.mapMock}>
              <iframe
                title="Google Maps - Vergnano Administraciones"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
