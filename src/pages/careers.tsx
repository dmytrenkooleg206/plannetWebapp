import CareersPage from '@/components/Pages/CareersPage/CareersPage';
import getStaticPropsGenerator from "@/utils/getStaticPropsGenerator";

const Careers = () => {
  return (
      <>
        <main>
          <CareersPage />
        </main>
      </>
  );
}

const services: any[] = [];

export const getStaticProps = async (context: any) => getStaticPropsGenerator(context, services);

export default Careers;
