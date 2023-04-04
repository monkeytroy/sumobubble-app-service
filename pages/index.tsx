import { getServerSideProps, IAppProps } from '@/services/server-side-props';
import ConfigSummary from '@/components/config-summary';
import { useAppStore } from '@/store/app-store';
import { useEffect } from 'react';

export default function Home(props: IAppProps) { 
    
  // app props on app state
  const setConfiguration = useAppStore((state: any) => state.setConfiguration);
  const setAppToken = useAppStore((state: any) => state.setAppToken);
    
  useEffect(() => {
    setConfiguration(props.configuration);
    setAppToken(props.token);
  }, []);

  return (
    <ConfigSummary></ConfigSummary>
  )
}

export { getServerSideProps }