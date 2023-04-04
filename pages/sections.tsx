import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { getServerSideProps, IAppProps } from '@/services/server-side-props';
import SectionSelection from '@/components/section-selection';

export default function Home(props: IAppProps) {

  // app props on app state
  const setConfiguration = useAppStore((state: any) => state.setConfiguration);
  const setAppToken = useAppStore((state: any) => state.setAppToken);
  
  useEffect(() => {
    setConfiguration(props.configuration);
    setAppToken(props.token);
  }, []);
  
  return (
    <SectionSelection></SectionSelection>
  )
}

export { getServerSideProps }