import React from 'react';
import { Eye, Handshake, Users, Check } from 'lucide-react';
import styles from './AboutUs.module.css';

export default function AboutUs({ content }) {
  const values = [
    {
      icon: <Eye size={20} />,
      title: content.value1Title,
      description: content.value1Description
    },
    {
      icon: <Handshake size={20} />,
      title: content.value2Title,
      description: content.value2Description
    },
    {
      icon: <Users size={20} />,
      title: content.value3Title,
      description: content.value3Description
    }
  ];

  return (
    <section id="nosotros" className={`section ${styles.aboutSection}`}>
      <div className="container">
        <div className={styles.grid}>
          
          {/* Column 1: Image / Graphics */}
          <div className={styles.imageColumn}>
            <div className={styles.imageWrapper}>
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" 
                alt="Edificios de Administración Vergnano" 
                className={styles.mainImage}
              />
              <div className={styles.experienceBadge}>
                <span className={styles.expYears}>{content.aboutExperienceNumber}</span>
                <span className={styles.expText}>{content.aboutExperienceText}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Content */}
          <div className={styles.contentColumn}>
            <span className="badge badge-red">{content.aboutBadge}</span>
            <h2 className={styles.title}>{content.aboutTitle}</h2>
            <p className={styles.leadText}>
              {content.aboutLead}
            </p>
            <p className={styles.description}>
              {content.aboutDescription}
            </p>

            {/* Values Accordion/Items */}
            <div className={styles.valuesList}>
              {values.map((value, idx) => (
                <div key={idx} className={styles.valueItem}>
                  <div className={styles.valueIconWrapper}>
                    {value.icon}
                  </div>
                  <div className={styles.valueText}>
                    <h4 className={styles.valueTitle}>{value.title}</h4>
                    <p className={styles.valueDesc}>{value.description}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
