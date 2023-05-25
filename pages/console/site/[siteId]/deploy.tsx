import { getServerSideProps, ISiteProps } from '@/services/ssp-site';
import SiteDeploy from '@/components/site-deploy';
import { useAppStore } from '@/store/app-store';
import { useEffect } from 'react';

export default function SiteHome(props: ISiteProps) { 

  // app props on app state
  const setConfiguration = useAppStore((state: any) => state.setConfiguration);
    
  useEffect(() => {
    setConfiguration(props.site);
  }, [setConfiguration, props.site]);
  
  return (
    <SiteDeploy></SiteDeploy>
  )
}

export { getServerSideProps }