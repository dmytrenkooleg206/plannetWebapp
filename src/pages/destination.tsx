import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import DestinationsPage from '@/components/Pages/DestinationPage/DestinationsPage';

export default function AllDestination() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="grow">
        <DestinationsPage />
      </main>
      <Footer />
    </div>
  );
}
