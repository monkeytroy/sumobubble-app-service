import { IAppProps, getServerSideProps } from '@/services/ssp-default';
import { useAppStore } from '@/store/app-store';
import { useEffect } from 'react';

import HomePricing from '@/components/home-pricing';
import HomeFeatures from '@/components/home-features';
import HomeIntro from '@/components/home-intro';

export default function Home(props: IAppProps) {
  const setCustomer = useAppStore((state: any) => state.setCustomer);

  useEffect(() => {
    setCustomer(props.customer);
  }, [setCustomer, props]);

  return (
    <div className="flex flex-col gap-24">
      <div>
        <HomeIntro />
      </div>

      <div id="features">
        <HomeFeatures />
      </div>

      <div id="pricing">
        <HomePricing {...props}></HomePricing>
      </div>
    </div>
  );
}

export { getServerSideProps };
