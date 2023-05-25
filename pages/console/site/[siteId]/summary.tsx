import { getServerSideProps, ISiteProps } from '@/services/ssp-site';
import ConfigSummary from '@/components/site-summary';
import { useAppStore } from '@/store/app-store';
import { useEffect } from 'react';

export default function SiteHome(props: ISiteProps) { 

  // app props on app state
  const setConfiguration = useAppStore((state: any) => state.setConfiguration);
    
  useEffect(() => {
    setConfiguration(props.site);
  }, [setConfiguration, props.site]);
  
  return (
    <ConfigSummary></ConfigSummary>
  )
}

export { getServerSideProps }