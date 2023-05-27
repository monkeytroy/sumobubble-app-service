
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';
import { apiMiddleware } from '@/services/api-middleware';
import connectMongo from '@/services/mongoose';
import Customer, { ICustomer } from '@/models/customer';
import { log } from '@/services/log';

const cors = Cors({
  methods: ['GET', 'POST', 'HEAD'],
});

export default async function handler(
  req: NextApiRequest, res: NextApiResponse<ConfigRes | any>
) {

  await apiMiddleware(req, res, cors);

  switch (req.method) {
    case 'GET': 
      //await get(req, res);
      break;
    case 'POST':
      await post(req, res);
      break;
    default: 
      res.status(405).send({ success: false, message: 'Method unsupported' })  
  }

}


const post = async (req: NextApiRequest, res: NextApiResponse<ConfigRes | any>) => {

  log('Webhook called', req.body);

  // handle invoice status.
  const event = req.body;
  const eventObject = event.data?.object;

  if (eventObject) {
    linkCustomer(eventObject);
    updateSubscription(eventObject);
  }

  res.status(200).send({ success: true, message: 'Success' });

};


/**
 * TODO Replace with queue event.
 * @param eventObject
 */
const linkCustomer = async (eventObject: any) => {

  if (eventObject.object == 'customer') {

    const id = eventObject.id;
    const email = eventObject.email;

    if (id && email) {

      try {
        connectMongo();
        
        const customer = await Customer.findOne({ email: email});
        if (customer) {
          customer.subscription.customerId = id;
          customer.save();
        } else {
          log(`linkCustomer:: error - customer was not found for email ${email}.`, eventObject);
        }

      } catch(err) {
        log(`linkCustomer:: error - failed linking customer to event object.`, err, eventObject);
      }

    } else {
      log(`linkCustomer:: error - customer object but missing id or email.`, eventObject);
    }

  }
}

/**
 * TODO Replace with queue
 * @param eventObject 
 */
const updateSubscription = async (eventObject: any) => {
  if (eventObject.object == 'subscription') {

    const customerId = eventObject.customer;
    const status = eventObject.status;
    const subscriptionId = eventObject.id;
    const items = eventObject.items;

    // todo store more info like dates.

    if (customerId) {

      try {
        connectMongo();
        
        const customer = await Customer.findOne({ 'subscription.customerId': customerId});
        if (customer) {
          customer.subscription.id = subscriptionId;
          customer.subscription.status = status;
          customer.save();
        } else {
          log(`updateSubscription:: error - could not find customer ${customerId} for event object.`, eventObject);
        }

      } catch(err) {
        log(`updateSubscription:: error - could not find customer ${customerId} for event object.`, err, eventObject);
      }

    } else {
      log(`updateSubscription:: error - customerId missing in event.`, eventObject);
    }

  }
}
