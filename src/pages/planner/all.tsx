import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import AllPlannersPage from '@/components/Pages/OurPlannersPage/AllPlannersPage';

export default function All() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="grow">
        <AllPlannersPage />
      </main>
      <Footer />
    </div>
  );
}
