import { IAppProps, getServerSideProps } from '@/services/ssp-default';
import HomePricing from '@/components/home-pricing';
import HomeFeatures from '@/components/home-features';
import { useAppStore } from '@/store/app-store';
import { useEffect } from 'react';

export default function Home(props: IAppProps) {
  const setCustomer = useAppStore((state: any) => state.setCustomer);

  useEffect(() => {
    setCustomer(props.customer);
  }, [setCustomer, props]);

  return (
    <div className="flex flex-col gap-24">
      <div id="product" className="relative isolate min-h-screen flex justify-center items-center">
        <div className="absolute inset-x-0 -z-20 transform-gpu overflow-hidden blur-3xl top-0" aria-hidden="true">
          <div
            className="relative -top-48 left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] 
            -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr 
            from-[#0080df] to-[#4089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-32 lg:py-36">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Coming soon!
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">SumoBubble</h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              An easy to create and use helper for your organizations website. Chat, summarized info, easy feedback and
              more.
            </p>
            {false && (
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm 
                      font-semibold text-white shadow-sm hover:bg-indigo-500 
                      focus-visible:outline focus-visible:outline-2 
                      focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Get started
                </a>
                <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            )}
          </div>
        </div>
        <div
          className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden 
          blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true">
          <div
            className="relative -top-24 left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] 
            -translate-x-1/2 bg-gradient-to-tr from-[#0030b5] to-[#9089fc] opacity-30 
            sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
            }}
          />
        </div>
      </div>

      <div id="features">
        <HomeFeatures></HomeFeatures>
      </div>

      <div id="pricing">
        <HomePricing {...props}></HomePricing>
      </div>
    </div>
  );
}

export { getServerSideProps };
