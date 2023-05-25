import { getServerSideProps, IAppProps } from '@/services/ssp-default';
import SiteAdd from '@/components/site-add';
import { IAppState, useAppStore } from '@/store/app-store';
import { useEffect } from 'react';
import SiteList from '@/components/site-list';
import ConsolePricing from '@/components/console-pricing';

export default function Console(props: IAppProps) { 
 
  // app props on app state
  const setSites = useAppStore((state: IAppState) => state.setSites);
  const sites = useAppStore((state: IAppState) => state.sites);

  useEffect(() => {
    setSites(props.sites || []);
  }, [setSites, props.sites]);
  
  return (
    <div className="flex flex-col gap-8 relative">

      {props?.customer?.subscription?.status != 'active' &&
        <ConsolePricing {...props}></ConsolePricing>
      }

      <div className="relative">
        <div className="md:w-2/3">
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-800 sm:text-3xl">Console</p>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Welcome! To get started, first create a site. From there you can set the main summary content of your InfoChatApp.
            Then checkout the different Sections that can be enabled to enhance the common user experience across all of your website's pages. 
            Finally, subscribe to use the app on your website!
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="font-semibold text-2xl text-gray-800">Sites</div>
        <div className="text-gray-600">
          Each site represents a place where InfoChatApp can be installed with common information, widgets and theme. 
        </div>
      </div>

      <div className="flex flex-col gap-16">
        
        {sites?.length < 1 && 
          <SiteAdd></SiteAdd>
        }

        <SiteList ></SiteList>
      </div>
    </div>
  )
}

export { getServerSideProps }