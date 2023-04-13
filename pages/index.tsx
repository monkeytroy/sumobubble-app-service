import { getServerSideProps, IAppProps } from '@/pages/server-side-props';
import ConfigSummary from '@/components/config-summary';
import { useAppStore } from '@/store/app-store';
import { useEffect } from 'react';

export default function Home(props: IAppProps) { 
    
  // app props on app state
  const setConfiguration = useAppStore((state: any) => state.setConfiguration);
    
  useEffect(() => {
    setConfiguration(props.configuration);
  }, []);

  return (
    <ConfigSummary></ConfigSummary>
  )
}

export { getServerSideProps }