import Configuration from "@/models/config";
import { CtxOrReq } from "next-auth/client/_utils";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import connectMongo from "./mongoose";

export interface IAppProps {
  configuration?: IBeaconConfig;
}

/**
 * Any page that gets server side props will read the session, the the customer id,
 * then load the configuration for that customer and pass it to the page in the props.
 * 
 * @param context 
 * @returns 
 */
export const getServerSideProps = async (context: CtxOrReq) => {
  
  const session = await getSession(context);
  
  const customerId = session?.user?.id;

  if (!customerId) {
    console.log(`Failed to read customerId for ${JSON.stringify(session?.user)}`);
    // return empty props.. no config. 
    return { props: {}}
  }

  await connectMongo();
          
  // fetch the customer    
  const configuration: IBeaconConfig | null = await Configuration.findOne({ customerId: customerId });

  if (configuration) {
    // no pin
    const { pin, __v, _id, ...configurationRes } = JSON.parse(JSON.stringify(configuration));  

    // Pass data to the page via props
    return { props: { 
      configuration: configurationRes
    } }
  } else {
    return { props: {
    }}
  }
}