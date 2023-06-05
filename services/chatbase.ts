import SiteState, { ChatbaseSeedState, ISiteState } from "@/models/siteState";
import { log } from "./log";
import connectMongo from "./mongoose";

const chatbaseUrl = 'https://www.chatbase.co/api/v1/';

interface IChatbasePayload {
  chatbotName: string;
  sourceText?: string;
  urlsToScrape?: Array<string>;
}

/**
 * Updates existing chatbot with site to scrape for info.
 * 
 * @param chatbaseId 
 * @param chatsite 
 * @returns 
 */
export const setupChatbot = async (chatsite: string, site: ISite) => {

  log(`setupChatbot for site ${site._id} with new chatsite ${chatsite}`);

  // process is...
  // 1. determine if chatbot is setup
  // 2. setup if does not exist.
  // 3. crawl chatsite url for urlsToScrape
  // 4. push urlstoScrape to chatbase
  // 5. save state to db.

  if (!site || !site._id) {
    return;
  }

  await connectMongo();
  
  let chatbaseId = site.chatbot.chatbaseId || null;

  log('Checking if chatbaseId exists', Date.now());

  let chatbotExists = false;
  if (chatbaseId) {
    // verify a chatbot already exists.
    chatbotExists = await checkChatbaseChatbotExists(chatbaseId);
  }

  // If not, try to create the chatbot in chatbase
  if (!chatbotExists) {
    log('Creating if chatbaseId didnt exist', Date.now());
    chatbaseId = await createChatbaseChatbot({
      chatbotName: site._id
    });
  }

  if (chatbaseId) {
    log('Kick off crawlAndScrape', Date.now());
    crawlAndScrape(chatbaseId, chatsite, site);
  }
  
  log('Returning chatbase id', Date.now());

  return chatbaseId;  
}

const crawlAndScrape = async (chatbotId: string, chatsite: string, site: ISite) => {

  if (site?._id) {

    // created.. so we can find / update / create
    const resetSiteState: ISiteState = {
      siteId: site._id,
      provisioned: true,
      seeded: ChatbaseSeedState.unseeded
    }

    const siteState = await SiteState.findOneAndUpdate({ siteId: site._id },
      resetSiteState, { upsert: true, new: true });

    // crawl site
    const crawlRes = await crawlChatsite(chatsite);
    const urlsToScrape = crawlRes?.map((val: { url: string } ) => val.url);

    if (urlsToScrape && urlsToScrape.length > 0) {
      const updateRes = await updateChatbotUrls(chatbotId, urlsToScrape);
      if (updateRes) {
        siteState.seeded = ChatbaseSeedState.seeded;
      } else {
        siteState.seeded = ChatbaseSeedState.seedfail;
      }
    } else {
      siteState.seeded = ChatbaseSeedState.seedfail;
    }

    siteState.save();
  }

}


const updateChatbotUrls = async (chatbotId: string, urlsToScrape: Array<string>) => {

  const query = {
    chatbotId,
    urlsToScrape
  };

  log(JSON.stringify(query), process.env.CHATBASE_API_KEY);

  const chatbaseRes = await fetch(chatbaseUrl + '/update-chatbot-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.CHATBASE_API_KEY
    },
    body: JSON.stringify(query)
  });

  return chatbaseRes.status === 200;
}


/**
 * Server create chatbot at chatbase
 */
const createChatbaseChatbot = async (
  {chatbotName, sourceText, urlsToScrape}: IChatbasePayload) => {

  // if (urlsToScrape?.length === 0 && (!sourceText || sourceText.length < 100)) {
  //   return null;
  // }

  // create the bot with stubbed info. 
  const payload: IChatbasePayload = {
    chatbotName,
    sourceText: 'Welcome to InfoChat App with AI powered chatbot.  We are trying to find the answer to your question so please be patiend.  Thanks!'
  };

  // if (sourceText && sourceText.length > 100) {
  //   payload = {
  //     ...payload,
  //     sourceText
  //   }
  // }

  // if (urlsToScrape) {
  //   payload = {
  //     ...payload,
  //     urlsToScrape
  //   }
  // }

  log(`Building payload for createChatbaseChatbot:  ${JSON.stringify(payload)}`);
  
  const chatbaseRes = await fetch(chatbaseUrl + '/create-chatbot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.CHATBASE_API_KEY
    },
    body: JSON.stringify(payload)
  });

  if (chatbaseRes?.status === 200) {
    const chatbaseResJson = await chatbaseRes.json();

    if (chatbaseResJson.chatbotId) {
      return chatbaseResJson.chatbotId;
    } else {
      log(`No chatbot was created ${JSON.stringify(chatbaseResJson)}`);  
    }
  } else {
    log(`Invalid response from chatbase ${chatbaseRes}`);
  }

  return null;
}

/**
 * Check if chatbot exists. 
 * @param chatbaseId
 * @returns boolean - exists?
 */
const checkChatbaseChatbotExists = async (chatbaseId: string) => {

  const query = {
    messages: [
      { content: 'Are you there?', role: 'user' }
    ],
    chatId: chatbaseId,
    stream: false,
    temperature: 0
  };

  const chatbaseRes = await fetch(chatbaseUrl + '/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.CHATBASE_API_KEY
    },
    body: JSON.stringify(query)
  });

  if (chatbaseRes.status === 200) {
    const resJson = await chatbaseRes.json();
    
    if (resJson?.text) {
      // safe bet bot exists.
      return true;
    }
  }

  return false;
}


/**
 * Tell chatbase to crawl the webiste and return array of sites to scrape.
 * @param chatsite 
 * @returns 
 */
const crawlChatsite = async (chatsite: string) => {

  log(`crawlChatsite - ${chatsite}`);

  const chatsiteRes = await fetch(`${chatbaseUrl}/fetch-links?sourceURL=${chatsite}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + process.env.CHATBASE_API_KEY
    }
  });

  if (chatsiteRes.status === 200) {
    const resJson = await chatsiteRes.json();
    return resJson.fetchedLinks;
  }

  return null;
}