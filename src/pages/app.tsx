import { useEffect } from 'react';

function AppPage() {
  useEffect(() => {
    if (typeof window !== `undefined`) {
      window.location.href = `https://plannet.onelink.me/dtoz`;
    }
  }, []);

  return <></>;
}

export default AppPage;
