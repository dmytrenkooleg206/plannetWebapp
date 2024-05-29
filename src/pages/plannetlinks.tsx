import PlannetlinksPage from "@/components/Pages/Plannetlinks/PlannetlinksPage";
import getStaticPropsGenerator from "@/utils/getStaticPropsGenerator";

const Plannetlinks = () => {
  return (
    <>
      <main>
        <PlannetlinksPage />
      </main>
    </>
  );
}

const services: any[] = [];

export const getStaticProps = async (context: any) => getStaticPropsGenerator(context, services);

export default Plannetlinks;
