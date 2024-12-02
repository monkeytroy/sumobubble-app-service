import { saveSite } from '@/services/site';
import { useAppStore } from '@/store/app-store';
import { ChatBubbleOvalLeftIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useCallback } from 'react';
import { ISection } from './sections';
import { ConsoleBody } from '@/components/console/console-body';
import { SubscriptionStatus } from '@/models/customer';
import ConsolePricing from '@/components/console/console-pricing';
import { IAppProps } from '@/services/ssp-default';

export const section: ISection = {
  name: 'chatbot',
  title: 'Ask AI',
  description: 'An AI powered chat bot based on your summary and website.',
  icon: <ChatBubbleOvalLeftIcon />,
  class: 'text-sm',
  component: <ConfigChatbot />,
  isInfoSection: false
};

export default function ConfigChatbot(props: IAppProps) {
  // site and editable values
  const site = useAppStore((state) => state.site);
  const customer = useAppStore((state) => state.customer);

  // setup local state for editing.
  const [enabled, setEnabled] = useState(false);
  const chatbot = site?.chatbot;

  // local component state
  const [saving, setSaving] = useState(false);
  const [invalid, setInvalid] = useState(false);

  // reset to site state
  const reset = useCallback(() => {
    setEnabled(!!chatbot?.enabled);
  }, [chatbot]);

  // reset to modified site upon changes from state
  useEffect(() => {
    reset();
  }, [reset, site]);

  const onSave = async () => {
    setInvalid(false);

    if (site) {
      setSaving(true);

      // copy configuration
      const newSite = JSON.parse(JSON.stringify(site));

      newSite.chatbot.enabled = enabled;

      // save!
      await saveSite(newSite);

      setTimeout(() => setSaving(false), 2000);
    }
  };

  const validateChatSiteUrl = (url: string) => {
    if (url) {
      var regExp = /^(https)?(\:\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^!=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])+$/;
      setInvalid(!regExp.test(url));
    }
  };

  return (
    <ConsoleBody
      full={true}
      title={section.title}
      subTitle={section.description}
      invalid={invalid}
      saving={saving}
      saveOff={customer?.subscription?.status != SubscriptionStatus.Active}
      onSave={() => onSave()}
      onCancel={() => reset()}>
      <div className="">
        {customer?.subscription?.status != SubscriptionStatus.Active && (
          <div className="text-lg text-gray-600 mt-4 flex flex-col gap-4">
            Subscribe to configure and enable chatbot.
            <div className="">
              <ConsolePricing {...props} startClosed={true}></ConsolePricing>
            </div>
          </div>
        )}

        {customer?.subscription?.status == SubscriptionStatus.Active && !customer?.subscription?.metadata?.chatbot && (
          <div
            className="mt-12 py-8 text-2xl text-gray-600 flex flex-col gap-8 text-center
            rounded-lg bg-gray-100">
            Your subscription does not support chatbot.. upgrade?
            <div className="text-xl">
              <a href="mailto:support@sumobubble.com">Contact us</a>
            </div>
          </div>
        )}

        {customer?.subscription?.status == SubscriptionStatus.Active && customer?.subscription?.metadata?.chatbot && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label htmlFor="spotlightUrl" className="block text-sm font-medium leading-6 text-gray-900">
                Chatbot Status
              </label>
              <div className="mx-6">
                {!chatbot?.chatbotId && (
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3 flex-1 md:flex md:justify-between">
                        <div className="text-sm text-blue-700">The chatbot has not been setup.</div>
                      </div>
                    </div>
                  </div>
                )}

                {chatbot?.chatbotId && (
                  <div className="w-full p-6 rounded bg-blue-200">Your chatbot is created and ready to go!</div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {chatbot?.chatbotId && (
                <div className="flex gap-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="sectionEnabled"
                      name="sectionEnabled"
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => setEnabled(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="sectionEnabled" className="font-medium text-gray-900">
                      Enable Chatbot
                    </label>
                  </div>
                </div>
              )}

              {
                // todo update with multi url input UI
              }
              <div className="flex flex-col gap-2">
                <label htmlFor="spotlightUrl" className="block text-sm font-medium leading-6 text-gray-900">
                  Chatbot Root Source (AI Trained from this website)
                </label>
                <div className="flex gap-3">
                  <div
                    className="w-128 max-w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 
                    focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 relative">
                    <input
                      pattern="^https://?[\w-]+(\.[\w-]+)+([\w.,@?^!=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])+$"
                      type="text"
                      name="siteUrl"
                      id="siteUrl"
                      placeholder="https://my-website.com"
                      value={''}
                      onChange={(e) => validateChatSiteUrl(e.target.value)}
                      aria-invalid={invalid}
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
                <div className="rounded-md bg-blue-50 mt-4 p-4 mx-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                      <div className="text-sm text-blue-700">
                        When the Chatbot Root Source is first entered or changed, setup and training of the chatbot
                        begins. This process may take some time depending on the amount of information on your website.
                        <br />
                        <br />
                        The chatbot will work right away, but may not understand everything about your website for
                        several minutes.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ConsoleBody>
  );
}

/**

  Not sure where we will land on this process.. so save some code.

  // apply button to chatsite
  <button type="button" 
    disabled={invalid || crawling}
    onClick={() => onSaveChatSite()}
    className="rounded-md bg-blue-500 py-2 px-3 text-sm font-semibold 
      text-white shadow-sm hover:bg-blue-600 disabled:opacity-25
      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
    Apply
  </button>

  // display urlsToScrape if need to show and deselect some.

  <div className="flex flex-col gap-4 pb-8">

    <div className="flex flex-col gap-3">
      <label htmlFor="spotlightUrl" className="block text-sm font-medium leading-6 text-gray-900">
        Chatbot Sources
      </label>
      <div className="mx-6 flex flex-col gap-3">
        <div>
          The URLs below will be the sources of information used to 
          train your AI chatbot! If there is a source you do not 
          want to include in the training process, remove it by 
          clicking the red X.
        </div>
        
        {crawling && 
          <div className="rounded-md bg-yellow-50 p-3">
            <div className="flex gap-4 items-start">
              <svg aria-hidden="true" 
                className="w-5 h-5 text-gray-300 animate-spin 
                  dark:text-gray-600 fill-yellow-500" 
                  viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <div className="flex flex-col gap-3">                           
                <div className="text-sm font-medium text-yellow-800">
                  Looking for sources...
                </div>
                <div className="text-sm text-yellow-700">
                  Please be patient as this will take a minute!
                </div>
              </div>
            </div>
          </div>
        }
        {!crawling && urlsToScrape?.length == 0 && 
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">
                  Enter the Chatbot Website URL to generate the chatbot sources.
                </p>
              </div>
            </div>
          </div>
        }
        {urlsToScrape?.length > 0 && 
          urlsToScrape.map((val: string) => (
            <div className="py-2 border-b border-gray-300 flex gap-2" key={val}>
              <button type="button" 
                onClick={() => removeSourceSite(val)}
                className="rounded-full text-gray-600 disabled:opacity-30
                  focus-visible:bg-indigo-200 focus-visible:ring-0 focus-visible:ring-offset-0
                  focus-visible:outline-0">
                <MinusCircleIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              <span>{val}</span>                          
            </div>
          )
        )}
      </div>
    </div>
  </div>
 
 */
