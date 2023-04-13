import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { getServerSideProps, IAppProps } from '@/pages/server-side-props';
import ConfigFunny from '@/components/config-funny';

export default function FunnyPage(props: IAppProps) {

  // app props on app state
  const setConfiguration = useAppStore((state: any) => state.setConfiguration);
    
  useEffect(() => {
    setConfiguration(props.configuration);
  }, []);
  
  return (
    <ConfigFunny></ConfigFunny>
  )
}

export { getServerSideProps }