import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { getServerSideProps, IAppProps } from '@/services/server-side-props';
import SectionSelection from '@/components/section-selection';

export default function Sections(props: IAppProps) {

  // app props on app state
  const setConfiguration = useAppStore((state: any) => state.setConfiguration);
  
  useEffect(() => {
    setConfiguration(props.configuration);
  }, [setConfiguration, props.configuration]);
  
  return (
    <SectionSelection></SectionSelection>
  )
}

export { getServerSideProps }