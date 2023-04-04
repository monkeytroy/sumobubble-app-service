import Configuration from "@/models/config";
import { CtxOrReq } from "next-auth/client/_utils";
import { getSession } from "next-auth/react";
import connectMongo from "./mongoose";

export interface IAppProps {
  configuration?: IBeaconConfig;
  token?: string;
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