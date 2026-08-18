import React from 'react';
import { ShieldCheck, FileText, Wrench, Scale } from 'lucide-react';
import styles from './Services.module.css';

export default function Services({ content }) {
  const servicesList = [
    {
      icon: <ShieldCheck size={32} />,
      title: content.service1Title,
      description: content.service1Description
    },
    {
      icon: <FileText size={32} />,
      title: content.service2Title,
      description: content.service2Description
    },
    {
      icon: <Wrench size={32} />,
      title: content.service3Title,
      description: content.service3Description
    },
    {
      icon: <Scale size={32} />,
      title: content.service4Title,
      description: content.service4Description
    }
  ];

  return (
    <section id="servicios" className={`section ${styles.servicesSection}`}>
      <div className="container">
        
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <span className="badge badge-red">{content.servicesBadge}</span>
          <h2 className={styles.sectionTitle}>{content.servicesTitle}</h2>
          <p className={styles.sectionSubtitle}>
            {content.servicesSubtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className={styles.servicesGrid}>
          {servicesList.map((service, index) => (
            <div key={index} className={styles.serviceCard}>
              <div className={styles.iconWrapper}>
                {service.icon}
              </div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
