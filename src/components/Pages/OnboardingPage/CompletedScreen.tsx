import Link from 'next/link';

export default function CompletedScreen() {
  return (
    <div className="max-w-[500px] w-full text-white m-auto relative">
      <div className="mx-5 relative">
        <div className="absolute bg-primary rounded-lg">
          <img src="/assets/images/onboarding/learn_more.png" alt="back" />
        </div>
        <div className="absolute bg-gradient-to-b from-black-100 from-10% via-black via-60% to-black max-w-[500px] w-full h-full rounded-lg" />
        <div className="w-full py-12 px-5 relative z-1">
          <div className="w-24 h-24 bg-primary rounded-full flex m-auto">
            <img
              className="w-12 flex m-auto"
              src="/assets/images/onboarding/access.svg"
              alt="trip"
            />
          </div>
          <div className="leading-tight md:leading-tight text-3xl md:text-5xl text-center font-bold mt-8 mb-8 md:mb-16">
            Access your
            <br />
            Trip Dashboard
          </div>
          <div className="text-xl md:text-3xl text-center font-bold">
            Download the Plannet app
          </div>
          <div className="flex justify-center mt-4">
            <Link href={`${process.env.NEXT_PUBLIC_APP_STORE}`} target="blank">
              <img
                className="max-w-[190px] w-full h-full pr-2"
                src="/assets/images/landingpage/app_store.png"
                alt="app_store"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
