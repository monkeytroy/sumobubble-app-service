import 'react-toastify/dist/ReactToastify.css';
import { ReactElement, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { getServerSideProps, ISiteProps } from '@/services/ssp-site';
import { useRouter } from 'next/router';
import { sections } from '@/components/sections/sections';
import React from 'react';

export default function SectionPage(props: ISiteProps) {

  const router = useRouter();
  const { section } = router.query || 'contact';

  // app props on app state
  const setSite = useAppStore((state) => state.setSite);
  const setSiteState = useAppStore((state) => state.setSiteState);
  const setCustomer = useAppStore((state) => state.setCustomer);

  useEffect(() => {
    if (props.site) {
      setSite(props.site);
    }
    if (props.customer) {
      setCustomer(props.customer);
    }
    if (props.siteState) {
      setSiteState(props.siteState);
    }
  }, [setSite, setCustomer, props.site, props.customer]);
  
  const child: ReactElement | undefined = sections.find((val) => val.name.toLowerCase() == section)?.component;

  return (
    <>
      {child && 
        <div>{React.cloneElement(child, props)}</div>
      }
    </>
  )
}

export { getServerSideProps }