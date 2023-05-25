import { saveSite } from "@/services/site";
import { useAppStore, IAppState } from "@/store/app-store";
import { ChatBubbleOvalLeftIcon, ExclamationCircleIcon,  } from "@heroicons/react/24/outline";
import { useState, FormEvent, useEffect, useCallback, useRef } from "react";
import ConfigSubmit from "../config-submit";
import { ISection } from "./sections";

export const section: ISection = {
  name: 'chatbot',
  title: 'AI Chatbot',
  description: 'An AI powered chat bot based on your summary and website.',
  route: 'sections/chatbot',
  icon: <ChatBubbleOvalLeftIcon/>,
  class: 'ml-2 text-xs',
  component: <ConfigChatbot/>
};

export default function ConfigChatbot() {

  const configuration = useAppStore((state: IAppState) => state.configuration);
  const activateChatbot = useAppStore((state: IAppState) => state.activateChatbot);

  // load this section.
  const thisSection: ISiteSection | undefined = configuration?.sections[section.name];

  // setup local state for editing.
  const [enabled, setEnabled] = useState(false);
  const [content, setContent] = useState('');
  const [chatsite, setChatsite] = useState('');
  
  const [chatbotCreating, setchatbotCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // reset / init the content when thisSection is set
  const reset = useCallback(() => {
    setEnabled(typeof thisSection?.enabled !== 'undefined' ? thisSection.enabled : false);
    setContent(thisSection?.content || '');
    setChatsite(thisSection?.props?.chatsite || '');
  }, [thisSection]);
  
  useEffect(() => {
    reset();
  }, [reset, configuration]);

  const submit = async (e: FormEvent) => {
    e.preventDefault(); 

    setInvalid(false);

    if (configuration) {
      setSaving(true);

      // copy configuration
      const newConfiguration = JSON.parse(JSON.stringify(configuration));

      // create the new section
      const newSection: ISiteSection = {
        enabled,
        content,
        props: {
          chatsite
        }
      }

      // spread it out...  old first
      newConfiguration.sections = {
        ...newConfiguration.sections,
        [section.name]: {...newSection}
      }

      // save!
      await saveSite(newConfiguration);

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
    if (configuration) {
      setchatbotCreating(true);
      await activateChatbot(configuration);
      setchatbotCreating(false);
    }
  }

  return (
    <form onSubmit={submit} onReset={reset} ref={formRef}>
      <div className="flex flex-col gap-6 pb-6 select-none">

        <div className="flex gap-4 items-baseline">
          <span className="text-xl font-semibold text-gray-900">{section.title}</span>
          <span className="text-sm text-gray-600">
            {section.description}
          </span>
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="spotlightUrl" className="block text-sm font-medium leading-6 text-gray-900">
            Chatbot Setup
          </label>
          <div className="mt-2">

            {configuration?.summary?.content && configuration.summary.content.length < 40 &&
              <div>
                To create the chatbot, your site summary must be more than 40 characters.
              </div>
            }

            {!thisSection?.props?.chatbaseId && 

              <button type="button" onClick={onCreateChatbot}
                disabled={chatbotCreating}
                className="px-4 py-2 rounded-md bg-indigo-600 p-1 text-white shadow-sm 
                  hover:bg-indigo-500 focus-visible:outline disabled:opacity-30
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Create
              </button>
            }

            {thisSection?.props?.chatbaseId && 
              <div>
                Your chatbot has been created.
              </div>
            }

          </div>
        </div>

        {thisSection?.props?.chatbaseId &&
          <div className="col-span-full flex gap-x-3">
            <div className="flex h-6 items-center">
              <input id="sectionEnabled" name="sectionEnabled" type="checkbox"
                checked={enabled} onChange={(e) => setEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
            <div className="text-sm leading-6">
              <label htmlFor="sectionEnabled" className="font-medium text-gray-900">
                Enable this section 
              </label>
            </div>
          </div>      
        }

        {thisSection?.props?.chatbaseId &&
          <div className="sm:col-span-4">
            <label htmlFor="spotlightUrl" className="block text-sm font-medium leading-6 text-gray-900">
              Chatbot Website URL
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
       
      </div>

      {thisSection?.props?.chatbaseId &&
        <ConfigSubmit saving={saving} invalid={invalid}></ConfigSubmit>
      }
        
    </form>
  )
}