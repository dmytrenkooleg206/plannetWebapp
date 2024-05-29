import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import Loader from '@/components/Loader/Loader';
import DestinationPage from '@/components/Pages/DestinationPage/DestinationPage';

export default function Destination() {
  const router: any = useRouter();
  const [urlId, setUrlId] = useState<string>('');
  useEffect(() => {
    if (router && router.query && router.query.urlId) {
      if (urlId !== router.query.urlId) setUrlId(router.query.urlId);
    }
  }, [router, urlId]);
  if (!urlId)
    return (
      <div className="h-screen flex my-auto">
        <Loader size={50} />
      </div>
    );
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="grow">
        <DestinationPage urlId={urlId} />
      </main>
      <Footer />
    </div>
  );
}
