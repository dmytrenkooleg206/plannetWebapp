import PlannetBusinessPage from '@/components/Pages/PlannetBusiness/PlannetBusinessPage';
import getStaticPropsGenerator from '@/utils/getStaticPropsGenerator';

function PlannetBusiness() {
  return (
    <>
      <main>
        <PlannetBusinessPage />
      </main>
    </>
  );
}

const services: any[] = [];

export const getStaticProps = async (context: any) =>
  getStaticPropsGenerator(context, services);

export default PlannetBusiness;
