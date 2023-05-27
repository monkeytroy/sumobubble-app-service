import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { getServerSideProps, ISiteProps } from '@/services/ssp-site';
import { useRouter } from 'next/router';
import { sections } from '@/components/sections/sections';

export default function SectionPage(props: ISiteProps) {

  const router = useRouter();
  const { section } = router.query || 'contact';

  // app props on app state
  const setSite = useAppStore((state) => state.setSite);
    
  useEffect(() => {
    if (props.site) {
      setSite(props.site);
    }
  }, [setSite, props.site]);
  
  return (
    <>
      {sections.find((val) => val.name.toLowerCase() == section)?.component}
    </>
  )
}

export { getServerSideProps }