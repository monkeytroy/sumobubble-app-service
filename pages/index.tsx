import LoginBtn from '@/components/login-btn';
import ConfigEdit from '@/components/config-edit';
import connectMongo from '@/services/mongoose';
import Configuration from '@/models/config';
import { getSession } from 'next-auth/react';
import { CtxOrReq } from 'next-auth/client/_utils';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { create } from 'zustand';
import { useEffect } from 'react';


export interface IAppState {
  count: number;
  refresh: () => void;
}

export const useAppStore = create<IAppState>(set => ({
  count: 1,
  refresh: () => set( state => ({ count: state.count + 1}) )
}));


export interface IAppProps {
  configuration: IBeaconConfig;
  token: string;
}

export const getServerSideProps = async (context: CtxOrReq) => {
  
  const session = await getSession(context);
  const customerId = session?.user?.id;

  await connectMongo();
          
  // fetch the customer    
  const configuration: IBeaconConfig | null = await Configuration.findOne({ customerId: customerId });

  if (configuration) {
    // no pin
    const { pin, __v, _id, ...configurationRes } = JSON.parse(JSON.stringify(configuration));  

    // Pass data to the page via props
    return { props: { 
      configuration: configurationRes,
      token: process.env.API_TOKEN
    } }
  } else {
    return { props: {
    }}
  }
}

export default function Home(props: IAppProps) {

  const router = useRouter();
  const count = useAppStore((state: any) => state.count);

  useEffect(() => {
    console.log('count change');
    router.replace(router.asPath);
  }, [count]);

  return (
    <div className="p-6 flex flex-col gap-8">
      <div className="flex w-full justify-between items-center">
        <div className="text-4xl font-bold tracking-tight text-gray-900 ">
          Beacon {count}
        </div>
        <div>
          <LoginBtn></LoginBtn>
        </div>
      </div>
      <div>
        <ToastContainer />
        <ConfigEdit {...props}></ConfigEdit>
      </div>

    </div>
  )
}