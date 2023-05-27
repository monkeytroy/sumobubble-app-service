import { log } from "./log";

const chatbaseUrl = 'https://www.chatbase.co/api/v1/';

/**
 * Server create chatbot at chatbase
 */
export const createChatbaseChatbot = async (title: string, sourceText: string) => {

  const payload = {
    chatbotName: title,
    sourceText
  };

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
    log(`No response from chatbase ${chatbaseRes}`);
  }

  return null;
}


/**
 * Check if chatbot exists. 
 */
export const checkChatbaseChatbotExists = async (chatbaseId: string) => {

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
 * Updates existing chatbot with site to scrape for info.
 * 
 * @param chatbaseId 
 * @param chatsite 
 * @returns 
 */
export const setChatbaseSiteAndRefresh = async (chatbaseId: string, chatsite: string) => {

  log(`setChatbaseSiteAndRefresh - ${chatbaseId} - ${chatsite}`);

  const query = {
    chatId: chatbaseId,
    urlsToScrape: [
      chatsite
    ]
  };

  log(query, process.env.CHATBASE_API_KEY);

  const chatbaseRes = await fetch(chatbaseUrl + '/update-chatbot-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.CHATBASE_API_KEY
    },
    body: JSON.stringify(query)
  });

  log(chatbaseRes);

  if (chatbaseRes.status === 200) {
    const resJson = await chatbaseRes.json();
    
    if (resJson?.chatbotId == chatbaseId) {
      return true;
    }
  }

  return false;

}