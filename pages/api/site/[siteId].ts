import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { apiMiddleware } from '@/services/api-middleware';
import connectMongo from '@/services/mongoose';
import Funny, { IFunny } from '@/models/funny';
import { log } from '@/services/log';
import Site from '@/models/site';
import { setupChatbot } from '@/services/chatbase';

const cors = Cors({
  methods: ['GET', 'POST', 'DELETE', 'HEAD']
});

const DEFAULT_TRANSLATION = 'ASV';

export default async function handler(req: NextApiRequest, res: NextApiResponse<ConfigRes | any>) {
  await apiMiddleware(req, res, cors);

  switch (req.method) {
    case 'GET':
      await get(req, res);
      break;
    case 'POST':
      await post(req, res);
      break;
    case 'DELETE':
      await deleteSite(req, res);
      break;
    default:
      res.status(405).send({ success: false, message: 'Method unsupported' });
  }
}

const get = async (req: NextApiRequest, res: NextApiResponse<ConfigRes | any>) => {
  try {
    await connectMongo();

    const { siteId } = req.query;

    const site = await Site.findById(siteId).select('-__v');

    // fetch the customer
    if (site) {
      // todo this looks old from pre file based config setup.
      // this would have to be queried or file updated daily.
      // fix.
      await getDailyFunny(site);

      // fix spotlight url
      const spotlight = site.sections?.get('spotlight');
      if (spotlight) {
        let spotlightUrl = spotlight?.urls[0];
        //log(`Spotlight url: ${spotlightUrl}`);
        if (spotlightUrl.indexOf('watch?v=') > 0) {
          spotlightUrl = spotlightUrl.replace('watch?v=', 'embed/');
          spotlight.urls = [spotlightUrl];
        }
      }

      res.status(200).json({ success: true, message: 'Message for you sir!', data: site.toJSON() });
    } else {
      console.log('Could not get config for site: ' + site);
      res.status(400).send({ success: false, message: 'No site config found' });
    }
  } catch (err) {
    res.status(405).send({ success: false, message: `Error ${(<Error>err)?.message}` });
    return;
  }
};

const invalid = (res: NextApiResponse, reason: string) => {
  res.status(400).send({ success: false, message: reason });
};

const post = async (req: NextApiRequest, res: NextApiResponse<ConfigRes | any>) => {
  // route should be protected in middleware.
  //const session = await getToken({ req, secret: process.env.JWT_SECRET })
  // // early exit if not authorized.
  // if (!session) {
  //   res.status(403).send({ success: false, message: 'Unauthorized'});
  //   return
  // }

  const { siteId } = req.query;

  log(`api/site/${siteId}/post`);

  try {
    await connectMongo();

    // const session = await getToken({ req, secret: process.env.JWT_SECRET });
    // const customerId = session?.sub;
    // if (!customerId) {
    //   invalid(res, 'Could not get the customer ID');
    //   return;
    // }

    const currentSite = await Site.findById(siteId);

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // TODO reworking chat

    // const newChatsite = body?.chatbot?.chatsite;

    // kick off process to make chatbot if...
    // no existing chatbaseId AND
    // there is a newChatsite that is not the same as the old chatsite.

    // if (
    //   (!currentSite.chatbot.chatbaseId && newChatsite) ||
    //   (newChatsite && newChatsite !== currentSite.chatbot.chatsite)
    // ) {
    //   const chatbaseId = await setupChatbot(newChatsite, currentSite);
    //   body.chatbot.chatbaseId = chatbaseId;
    // }

    const site = await Site.findOneAndUpdate({ _id: siteId }, body, {
      new: true
    });

    if (site) {
      const { __v, ...siteRes } = site.toJSON();
      res.status(200).json({ success: true, message: 'Updated', data: siteRes });
    } else {
      log('Could not update siteId: ' + siteId);
      invalid(res, 'Failed to update.');
      return;
    }
  } catch (err) {
    res.status(405).send({ success: false, message: `Error ${(<Error>err)?.message}` });
    return;
  }
};

const deleteSite = async (req: NextApiRequest, res: NextApiResponse<ConfigRes | any>) => {
  const { siteId } = req.query;

  try {
    await connectMongo();

    const deleteRes = await Site.findOneAndDelete({ _id: siteId });

    // todo dont return deleteRes
    if (deleteRes) {
      res.status(200).json({ success: true, message: 'Updated', data: deleteRes });
    } else {
      log('Could not remove site');
      invalid(res, 'Could not remove site.');
      return;
    }
  } catch (err) {
    res.status(405).send({ success: false, message: `Error ${(<Error>err)?.message}` });
    return;
  }
};

const getDailyFunny = async (siteConfig: any) => {
  log('getDailyFunny -------------------------------------------------------');
  const funny = JSON.parse(JSON.stringify(siteConfig.sections.get('funny') || {}));

  if (funny && funny.enabled) {
    const d = new Date();
    const findToday = parseInt(d.toISOString().split('T')[0].replace(/\-/g, ''));

    log('funny: ', funny);

    if (funny?.props?.autoFill) {
      // fall back on disabled
      funny.enabled = false;
      try {
        const funnyRes: Array<IFunny> = await Funny.find({ day: { $lte: findToday } })
          .sort({ day: -1 })
          .limit(1);
        //log('funnyRes: ', funnyRes);

        if (funnyRes[0]) {
          const daily = funnyRes[0];
          log('daily: ', daily, daily.urls);

          // merge in the funny lines.
          funny.content = daily.content;
          funny.urls = [...daily.urls];
          log('funny: ', funny);

          funny.enabled = true;
          siteConfig.sections.set('funny', funny);
          log('getDailyFunny is setting funny section to: ', siteConfig);
        }
      } catch (err) {
        console.log('Could not pull in funny for today.', err);
      }
    }
  } else {
    log('funny: No funny section detected to fill with daily');
  }
};
