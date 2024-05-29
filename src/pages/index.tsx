import LandingPage from '@/components/Pages/LandingPage/LandingPage';
import getStaticPropsGenerator from '../utils/getStaticPropsGenerator';

function Home() {
  return (
    <>
      <main>
        <LandingPage />
      </main>
    </>
  );
}

const services: any[] = [];

export const getStaticProps = async (context: any) =>
  getStaticPropsGenerator(context, services);

export default Home;
