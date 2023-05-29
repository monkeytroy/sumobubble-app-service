import { AccountSettings } from '@/components/account-settings';
import { getServerSideProps, IAppProps } from '@/services/ssp-default';
import { useAppStore } from '@/store/app-store';
import { useEffect } from 'react';

export default function Console(props: IAppProps) { 
 
  // app props on app state
  const setSites = useAppStore((state) => state.setSites);
  const setCustomer = useAppStore((state) => state.setCustomer);

  useEffect(() => {
    setSites(props.sites || []);
    if (props.customer) {
      setCustomer(props.customer);
    }
  }, [setSites, setCustomer, props.sites, props.customer]);
  
  return (
    <AccountSettings {...props}/>
  )
}

export { getServerSideProps }