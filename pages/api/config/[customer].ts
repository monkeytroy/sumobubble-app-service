
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';
import { midware } from '@/services/midware';
import copyright from './copyright.json';
import SimpleCrypto from "simple-crypto-js"
import connectMongo from '@/services/mongoose';
import Configuration from '@/models/config';
import Funny from '@/models/funny';
import Verse from '@/models/verse';
import { log } from '@/services/log';

const crypto = new SimpleCrypto(process.env.CRYPTO_KEY);
const copyrights: Copyrights = copyright;

const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCRUFDT04iLCJuYW1lIjoiR2xvYmFsIiwiaWF0IjoxNTE2MTM5MDIyfQ.eVrEhwKxF4Dfj2S5fFFMnwLAae-E1h3Ilo9PQKgPYic';

const cors = Cors({
  methods: ['GET', 'GET', 'HEAD'],
});

const DEFAULT_TRANSLATION = 'ASV';

export default async function handler(
  req: NextApiRequest, res: NextApiResponse<ConfigRes | any>
) {

  await midware(req, res, cors);

  switch (req.method) {
    case 'GET': 
      await get(req, res);
      break;
    case 'PUT':
      await put(req, res);
      break;
    case 'POST':
      await post(req, res);
      break;
    default: 
      res.status(405).send({ success: false, message: 'Method unsupported' })  
  }

}

/**
 * Create a new record.
 * @param req 
 * @param res 
 * @returns 
 */
const put = async (req: NextApiRequest, res: NextApiResponse<ConfigRes | any>) => {

  try {
    await connectMongo();
    
    const { customer } = req.query;
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // encrypt pin
    if (typeof body.pin !== 'undefined') {
      const pin = body.pin;
      if (typeof pin != 'string' || pin.length != 4) {
        invalid(res, 'pin must be a string of 4 characters.');
        return;
      }
      const encPin = crypto.encrypt(pin);
      body.pin = encPin;
    }
    
    body.customerId = customer;

    const configuration = await Configuration.create(body);
    const { pin, __v, ...configurationRes} = configuration.toJSON();  

    res.json({ success: true, message: 'Created', data: configurationRes });

  } catch (err: any) {
    console.log(err);
    res.status(400).send({ success: false, message: err?.message || 'Something went wrong.'});
  }

}

const get = async (req: NextApiRequest, res: NextApiResponse<ConfigRes | any>) => {

  try {
    await connectMongo();

    const { customer } = req.query;
  
    let configuration = await Configuration.findOne({ customerId: customer });

    // fetch the customer
    if (configuration) {

      await getDailyFunny(configuration);
      await getDailyVerse(configuration);
      
      const { pin, __v, ...configurationRes} = configuration.toJSON();  
      res.status(200).json({ success: true, message: 'Message for you sir!', data: configurationRes });

     } else {
       console.log('Could not get config for client: ' + customer);
       res.status(400).send({ success: false, message: 'No config found'});
     }

  } catch(err) {
    res.status(405).send({ success: false, message: `Error ${(<Error>err)?.message}`});
    return;
  }
}

const invalid = (res: NextApiResponse, reason: string) => {
  res.status(400).send({ success: false, message: reason});
}

const post = async (req: NextApiRequest, res: NextApiResponse<ConfigRes | any>) => {

  // early exit if not authorized.
  if (req.headers.authorization != JWT) {
    res.status(403).send({ success: false, message: 'Unauthorized'});
    return 
  }

  try {
    await connectMongo();

    const { customer } = req.query;
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // encrypt pin
    if (typeof body.pin !== 'undefined') {
      const pin = body.pin;
      if (typeof pin != 'string' || pin.length != 4) {
        invalid(res, 'pin must be a string of 4 characters.');
        return;
      }
      const encPin = crypto.encrypt(pin);
      body.pin = encPin;
    }

    const configuration = await Configuration.findOneAndUpdate({ customerId: customer }, body, {
      new: true
    }); 

    if (configuration) {
      const { pin, __v, ...configurationRes} = configuration.toJSON();
      res.status(200).json({ success: true, message: 'Updated', data: configurationRes });  
    } else {
      console.log('Could not update customer ' + customer);
      res.status(400).send({ success: false, message: 'Failed to update.'});
      return;
    }

  } catch(err) {
    res.status(405).send({ success: false, message: `Error ${(<Error>err)?.message}`});
    return;
  }

}

const getDailyVerse = async (custConfig: any) => {
  
  const d = new Date();
  const findToday = parseInt((d.toISOString().split('T')[0]).replace(/\-/g, ''));

  // copy the verse.
  const verse = JSON.parse(JSON.stringify(custConfig.sections.verse || {}));

  if (verse) {
    const trans = verse.translation || DEFAULT_TRANSLATION;

    // get translation copyright. 
    verse.props.copyright = copyrights[trans] || '';

    log('copyright:', verse.props.copyright);
    log('verse:', verse);

    // if cust config does not have a verse set.. get daily
    if (verse.enabled && (verse.props.autoFill)) {
      try {
        const verseRes = await Verse.find({day: { $lte: findToday }}).sort({ day: -1}).limit(1);
        log('verseRes:', verseRes);

        if (verseRes[0]) {
          const daily = verseRes[0];          
          verse.props.verseRef = daily.verseRef;

          // merge in the verse by the translation
          const content: string = daily.verses.get(trans);
          verse.content = content;

          custConfig.sections.verse = {...verse};
          log('getDailyVerse setting verse section: ', custConfig.sections.verse);
        }
      } catch(err) {
        console.log('Could not pull in funny for today.', err);
      }
    }
  }
}

const getDailyFunny = async (custConfig: any) => {

  const d = new Date();
  const findToday = parseInt((d.toISOString().split('T')[0]).replace(/\-/g, ''));

  const funny = JSON.parse(JSON.stringify(custConfig.sections.funny || {}));
  log('funny: ', funny);

  if (funny?.enabled && funny?.props?.autoFill) {
    try {

      const funnyRes = await Funny.find({day: { $lte: findToday }}).sort({ day: -1}).limit(1);
      log('funnyRes: ', funnyRes);

      if (funnyRes[0]) {
        const daily = funnyRes[0];
        // merge in the funny lines.
        funny.content = daily.content;
        
        custConfig.sections.funny = {...funny};
        log('getDailyFunny setting funny section: ', custConfig.sections.funny);
      }
    } catch(err) {
      console.log('Could not pull in funny for today.', err);
    }
  }
}