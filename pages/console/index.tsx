import { getServerSideProps, IAppProps } from '@/services/ssp-default';
import SiteAdd from '@/components/site-add';
import { useAppStore } from '@/store/app-store';
import { useEffect } from 'react';
import SiteList from '@/components/site-list';
import ConsolePricing from '@/components/console-pricing';

export default function Console(props: IAppProps) { 
 
  // app props on app state
  const setSites = useAppStore((state) => state.setSites);
  const sites = useAppStore((state) => state.sites);

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
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-800 sm:text-3xl">
            Account
          </p>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Welcome! Ready to get started?
          </p>
          <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
            <div className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                1. Create a Site
              </dt>{' '}
              <dd className="inline">
                Start out by creating a site below. Then select it!
              </dd>
            </div>
            <div className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                2. Configure the Site
              </dt>{' '}
              <dd className="inline">
                Enter a summary for your site that will display when someone opens InfoChat. 
                You can also enable and configure additional sections.
              </dd>
            </div>
            <div className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                3. Publish!
              </dt>{' '}
              <dd className="inline">
                When you have Info Chat all setup... publish to make it public!
              </dd>
            </div>
          </dl>
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