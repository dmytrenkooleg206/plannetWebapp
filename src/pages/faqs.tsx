import FAQsPage from '@/components/Pages/FAQsPage';
import getStaticPropsGenerator from '@/utils/getStaticPropsGenerator';

function Careers() {
  return (
    <>
      <main>
        <FAQsPage />
      </main>
    </>
  );
}

const services: any[] = [];

export const getStaticProps = async (context: any) =>
  getStaticPropsGenerator(context, services);

export default Careers;
