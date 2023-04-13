import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { getServerSideProps, IAppProps } from '@/server-side-props';
import ConfigVerse from '@/components/config-verse';

export default function VersePage(props: IAppProps) {

  // app props on app state
  const setConfiguration = useAppStore((state: any) => state.setConfiguration);
    
  useEffect(() => {
    setConfiguration(props.configuration);
  }, [setConfiguration, props.configuration]);
  
  return (
    <ConfigVerse></ConfigVerse>
  )
}

export { getServerSideProps }