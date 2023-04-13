import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { getServerSideProps, IAppProps } from '@/server-side-props';
import ConfigContact from '@/components/config-contact';

export default function ContactPage(props: IAppProps) {

  // app props on app state
  const setConfiguration = useAppStore((state: any) => state.setConfiguration);
    
  useEffect(() => {
    setConfiguration(props.configuration);
  }, [setConfiguration, props.configuration]);
  
  return (
    <ConfigContact></ConfigContact>
  )
}

export { getServerSideProps }