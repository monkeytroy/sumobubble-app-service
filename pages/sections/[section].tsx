import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { getServerSideProps, IAppProps } from '@/services/server-side-props';
import { useRouter } from 'next/router';
import { sections } from '@/components/sections/sections';

export default function SectionPage(props: IAppProps) {

  const router = useRouter();
  const { section } = router.query || 'contact';

  // app props on app state
  const setConfiguration = useAppStore((state: any) => state.setConfiguration);
    
  useEffect(() => {
    setConfiguration(props.configuration);
  }, [setConfiguration, props.configuration]);
  
  return (
    <>
      {sections.find((val) => val.name.toLowerCase() == section)?.component}
    </>
  )
}

export { getServerSideProps }