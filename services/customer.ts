import Customer, { IBeaconCustomer, SubscriptionStatus, Membership } from "@/models/customer";
import { log } from "./log";
import connectMongo from "./mongoose";

interface IFetchOrCreateCustomerProps {
  customerId: string;
  username?: string | null;
  email: string;
}

export const fetchOrCreateCustomer = async (
    {customerId, username, email}: IFetchOrCreateCustomerProps): 
    Promise<IBeaconCustomer | null> => { 

  await connectMongo();

  log(`fetchOrCreateCustomer::Looking for ${customerId} ${email}`);

  // fetch or create customer rec
  let customer: IBeaconCustomer | null = await Customer.findOne({ email: email });
  if (!customer) {
    const newCustomer: IBeaconCustomer = {
      email,
      customerId,
      name: username || '',
      subscription: { 
        status: SubscriptionStatus.Incomplete
      },
      membership: Membership.Preview
    }
    customer = await Customer.create(newCustomer);
  }

  const { __v, ...customerRes } = JSON.parse(JSON.stringify(customer));  

  return customerRes;
}