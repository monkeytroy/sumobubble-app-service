import { saveSite } from '@/services/site';
import { useAppStore } from '@/store/app-store';
import { ChatBubbleOvalLeftIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useCallback } from 'react';
import { ISection } from './sections';
import { ConsoleBody } from '@/components/console/console-body';
import { SubscriptionStatus } from '@/models/customer';
import ConsolePricing from '@/components/console/console-pricing';
import { IAppProps } from '@/services/ssp-default';

export const section: ISection = {
  name: 'chat',
  title: 'Ask AI',
  description: 'An AI powered chat feature based on document sources.',
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
  const [chatsite, setChatsite] = useState('');
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

      // replace.
      newSite.chatbot.chatsite = chatsite;
      newSite.chatbot.enabled = enabled;

      // save!
      await saveSite(newSite);

      setTimeout(() => setSaving(false), 2000);
    }
  };

  // const validateChatSiteUrl = (url: string) => {
  //   setChatsite(url);
  //   if (url) {
  //     var regExp = /^(https)?(\:\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^!=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])+$/;
  //     setInvalid(!regExp.test(url));
  //   }
  // };

  const processFile = (files: FileList | null) => {
    if (files?.length) {
      console.log(files[0]);

      // todo upload
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
            Subscribe to configure and enable Ask AI.
            <div className="">
              <ConsolePricing {...props} startClosed={true}></ConsolePricing>
            </div>
          </div>
        )}

        {customer?.subscription?.status == SubscriptionStatus.Active && !customer?.subscription?.metadata?.chatbot && (
          <div
            className="mt-12 py-8 text-2xl text-gray-600 flex flex-col gap-8 text-center
            rounded-lg bg-gray-100">
            Your subscription does not support Ask AI. Would you like to upgrade?
            <div className="text-xl">
              <a href="mailto:support@sumobubble.com">Contact us</a>
            </div>
          </div>
        )}

        {customer?.subscription?.status == SubscriptionStatus.Active && customer?.subscription?.metadata?.chatbot && (
          <div className="flex flex-col gap-8">
            <div className="flex gap-3">
              <div className="flex h-6 items-center">
                <input
                  id="askAiEnabled"
                  name="askAiEnabled"
                  type="checkbox"
                  disabled={chatbot?.chatbotId == undefined || chatbot?.chatbotId == null}
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
              <div className="text-sm leading-6">
                <label htmlFor="askAiEnabled" className="font-medium text-gray-900">
                  Enable this section
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="mx-6">
                {true && (
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3 flex-1 md:flex md:justify-between">
                        <div className="text-sm text-blue-700">
                          The chatbot needs documents with information used to answer questions. Upload one or more
                          documents to make chatbot active.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="spotlightUrl" className="block text-sm font-medium leading-6 text-gray-900">
                Upload a source document for Ask AI
              </label>
              <div className="flex gap-3">
                <div
                  className="w-128 max-w-full flex rounded-md ring-0 ring-inset ring-gray-300 
                  focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 relative">
                  <input
                    type="file"
                    name="uploadDoc"
                    id="uploadDoc"
                    aria-invalid={invalid}
                    onChange={(e) => processFile(e.target.files)}
                    className="peer disabled:opacity-30
                      block w-full rounded-md border-0 text-gray-900 invalid:text-red-900 py-1.5 pr-10 
                      ring-0 invalid:ring-red-300
                      focus:ring-0  
                      sm:py-1.5 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="text-xl p-8">
              <hr></hr>
              <div>~ Document list coming soon ~</div>
            </div>
          </div>
        )}
      </div>
    </ConsoleBody>
  );
}
