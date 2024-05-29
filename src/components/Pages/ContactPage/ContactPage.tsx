import MainLayout from '@/components/layouts/MainLayout';
import React from 'react';
import Introduction from './SectionsV2/Introduction';
import ContactForm from './SectionsV2/ContactForm';

export default function ContactPage() {
  return (
    <MainLayout>
      <Introduction />
      <ContactForm />
    </MainLayout>
  );
}
