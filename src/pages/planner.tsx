import BecomeAPlanner from '@/components/Pages/BecomeAPlannerPage/BecomeAPlannerPage';
import getStaticPropsGenerator from "@/utils/getStaticPropsGenerator";

const Planner = () => {
    return (
        <>
            <main>
                <BecomeAPlanner />
            </main>
        </>
    );
}

const services: any[] = [];

export const getStaticProps = async (context: any) => getStaticPropsGenerator(context, services);

export default Planner;
