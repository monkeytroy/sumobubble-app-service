import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { getServerSideProps, IAppProps } from '@/services/server-side-props';
import ConfigSpotlight from '@/components/config-spotlight';

export default function ContactPage(props: IAppProps) {

  // app props on app state
  const setConfiguration = useAppStore((state: any) => state.setConfiguration);
  const setAppToken = useAppStore((state: any) => state.setAppToken);
    
  useEffect(() => {
    setConfiguration(props.configuration);
    setAppToken(props.token);
  }, []);
  
  return (
    <ConfigSpotlight></ConfigSpotlight>
  )
}

export { getServerSideProps }