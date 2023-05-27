import { saveSite } from "@/services/site";
import { useAppStore } from "@/store/app-store";
import { ChatBubbleOvalLeftIcon, ExclamationCircleIcon,  } from "@heroicons/react/24/outline";
import { useState, FormEvent, useEffect, useCallback, useRef } from "react";
import ConfigSubmit from "../submit-form";
import { ISection } from "./sections";

export const section: ISection = {
  name: 'chatbot',
  title: 'AI Chatbot',
  description: 'An AI powered chat bot based on your summary and website.',
  icon: <ChatBubbleOvalLeftIcon/>,
  class: 'text-sm',
  component: <ConfigChatbot/>,
  isInfoSection: false
}

export default function ConfigChatbot() {

  const site = useAppStore((state) => state.site);
  const activateChatbot = useAppStore((state) => state.activateChatbot);

  // load this section.
  const chatbot = site?.chatbot;

  // setup local state for editing.
  const [enabled, setEnabled] = useState(false);
  const [chatsite, setChatsite] = useState('');
  
  const [chatbotCreating, setchatbotCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // reset / init the content
  const reset = useCallback(() => {
    setEnabled(typeof chatbot?.enabled !== 'undefined' ? chatbot.enabled : false);
    setChatsite(chatbot?.chatsite || '');
  }, [chatbot]);
  
  useEffect(() => {
    reset();
  }, [reset, site]);

  const submit = async (e: FormEvent) => {
    e.preventDefault(); 

    setInvalid(false);

    if (site) {
      setSaving(true);

      // copy configuration
      const newSite = JSON.parse(JSON.stringify(site));

      newSite.chatbot.chatsite = chatsite;
      newSite.chatbot.enabled = enabled;

      // save!
      await saveSite(newSite);

      setTimeout(() => setSaving(false), 2000);
    }
  }

  useEffect(() => {
    setInvalid(enabled && (!formRef.current?.checkValidity()));
  }, [chatsite, enabled])

  const validateChatSiteUrl = (url: string) => {
    if (url) {
      var regExp = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+$/;
      setInvalid(!regExp.test(url));
      setChatsite(url);
    }
  }

  const onCreateChatbot = async () => {
    if (site) {
      setchatbotCreating(true);
      await activateChatbot(site);
      setchatbotCreating(false);
    }
  }

  return (
    <div className="w-1/2 min-w-fit select-none divide-y divide-gray-300">

      <div className="flex flex-col gap-4 pb-8">

        <div className="flex gap-4 items-baseline">
          <span className="text-xl font-semibold text-gray-900">{section.title}</span>
          <span className="text-sm text-gray-600">
            {section.description}
          </span>
        </div>

        <div className="sm:col-span-2 flex flex-col gap-4">
          <label htmlFor="spotlightUrl" className="block text-sm font-medium leading-6 text-gray-900">
            Chatbot Status
          </label>
          <div className="mx-6">

            {site?.summary?.content && site.summary.content.length < 40 &&
              <div>
                To create the chatbot, your site summary must be more than 40 characters.
              </div>
            }

            {!chatbot?.chatbaseId && 
              <div className="flex flex-col gap-4 items-start">
                <div>First time eh?  Provision your chatbot to make it available to your site.</div>
                <button type="button" onClick={onCreateChatbot}
                  disabled={chatbotCreating}
                  className="px-4 py-2 rounded-md bg-indigo-600 p-1 text-white shadow-sm 
                    hover:bg-indigo-500 focus-visible:outline disabled:opacity-30
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Provision Chatbot
                </button>
              </div>
            }

            {chatbot?.chatbaseId && 
              <div className="w-full p-6 rounded bg-blue-200">
                Your chatbot is created and ready to go!
              </div>
            }

          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-8">
        <form onSubmit={submit} onReset={reset} ref={formRef}>
          <div className="flex flex-col gap-4">

            {chatbot?.chatbaseId &&
              <div className="col-span-full flex gap-x-3">
                <div className="flex h-6 items-center">
                  <input id="sectionEnabled" name="sectionEnabled" type="checkbox"
                    checked={enabled} onChange={(e) => setEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="text-sm leading-6">
                  <label htmlFor="sectionEnabled" className="font-medium text-gray-900">
                    Enable Chatbot
                  </label>
                </div>
              </div>      
            }

            {chatbot?.chatbaseId &&
              <div className="sm:col-span-4">
                <label htmlFor="spotlightUrl" className="block text-sm font-medium leading-6 text-gray-900">
                  Chatbot Website URL (AI uses site data to answer questions)
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 
                    focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md relative">
                      
                    <input
                      disabled={!enabled}
                      pattern="https?://.+"
                      type="text" name="siteUrl" id="siteUrl"
                      placeholder="https://my-website.com"
                      value={chatsite} 
                      onChange={e => validateChatSiteUrl(e.target.value)} 
                      className="peer disabled:opacity-30
                        block w-full rounded-md border-0 text-gray-900 invalid:text-red-900 shadow-sm py-1.5 pr-10 
                        ring-1 ring-inset ring-gray-300 invalid:ring-red-300 placeholder:text-gray-300 
                        focus:ring-2 focus:ring-inset focus:ring-indigo-600 invalid:focus:ring-red-500 sm:py-1.5 sm:text-sm sm:leading-6"

                    />

                    <div className="hidden peer-invalid:flex pointer-events-none absolute inset-y-0 right-0 items-center pr-3">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>

                  </div>
                </div>
              </div>
            }

            {chatbot?.chatbaseId &&
              <ConfigSubmit saving={saving} invalid={invalid}></ConfigSubmit>
            }
          </div>
        </form>        

      </div>
    </div>
        
    
  )
}