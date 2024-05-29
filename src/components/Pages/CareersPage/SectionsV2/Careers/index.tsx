import React from 'react';
import styles from './index.module.scss';
import {
  engineeringRoles,
  productRoles,
  marketingRoles,
  travelsRoles,
} from './roles';

export default function Careers() {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.sectionTitle}>Travel</div>
        <div className={styles.sectionContent}>
          {travelsRoles.map((position) => {
            const { role, key, location } = position;
            return (
              <div key={key} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardRole}>{role}</div>
                  <div className={styles.remote}>Remote</div>
                </div>
                <div className={styles.cardLocation}>
                  <span className={styles.location}>{location}</span>
                  <div className={styles.remote}>Remote</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.sectionTitle}>Product</div>
        <div className={styles.sectionContent}>
          {productRoles.map((position) => {
            const { role, key, location } = position;
            return (
              <div key={key} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardRole}>{role}</div>
                  <div className={styles.remote}>Remote</div>
                </div>
                <div className={styles.cardLocation}>
                  <span className={styles.location}>{location}</span>
                  <div className={styles.remote}>Remote</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.sectionTitle}>Marketing</div>
        <div className={styles.sectionContent}>
          {marketingRoles.map((position) => {
            const { role, key, location } = position;
            return (
              <div key={key} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardRole}>{role}</div>
                  <div className={styles.remote}>Remote</div>
                </div>
                <div className={styles.cardLocation}>
                  <span className={styles.location}>{location}</span>
                  <div className={styles.remote}>Remote</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.sectionTitle}>Engineering</div>
        <div className={styles.sectionContent}>
          {engineeringRoles.map((position) => {
            const { role, key, location } = position;
            return (
              <div key={key} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardRole}>{role}</div>
                  <div className={styles.remote}>Remote</div>
                </div>
                <div className={styles.cardLocation}>
                  <span className={styles.location}>{location}</span>
                  <div className={styles.remote}>Remote</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
