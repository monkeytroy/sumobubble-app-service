import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { getServerSideProps, ISiteProps } from '@/services/ssp-site';
import SectionSelection from '@/components/section-selection';

export default function Sections(props: ISiteProps) {

  // app props on app state
  const setConfiguration = useAppStore((state: any) => state.setConfiguration);
  
  useEffect(() => {
    setConfiguration(props.site);
  }, [setConfiguration, props.site]);
  
  return (
    <SectionSelection></SectionSelection>
  )
}

export { getServerSideProps }