import ContactPage from '@/components/Pages/ContactPage/ContactPage';
import getStaticPropsGenerator from '@/utils/getStaticPropsGenerator';

function Contact() {
  return (
    <>
      <main>
        <ContactPage />
      </main>
    </>
  );
}

const services: any[] = [];

export const getStaticProps = async (context: any) =>
  getStaticPropsGenerator(context, services);

export default Contact;
