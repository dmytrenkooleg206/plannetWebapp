import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import OurPlannersPage from '@/components/Pages/OurPlannersPage/OurPlannersPage';

export default function PlannerAbout() {
  return (
    <>
      <div className="bg-primary">
        <Header isDark />
      </div>
      <main>
        <OurPlannersPage />
      </main>
      <Footer />
    </>
  );
}
