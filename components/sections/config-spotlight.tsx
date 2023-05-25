import { saveSite } from "@/services/site";
import { IAppState, useAppStore } from "@/store/app-store";
import { ExclamationCircleIcon, ExclamationTriangleIcon, TvIcon } from "@heroicons/react/24/outline";
import { useState, FormEvent, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import ConfigSubmit from "../config-submit";
import { ISection } from "./sections";

export const section: ISection = {
  name: 'spotlight',
  title: 'Spotlight',
  description: 'A video or channel to spotlight for your guests.',
  route: 'sections/spotlight',
  icon: <TvIcon/>,
  class: 'ml-2 text-xs',
  component: <ConfigSpotlight/>
};

export default function ConfigSpotlight() {

  const configuration = useAppStore((state: IAppState) => state.configuration);

  // load this section.
  const thisSection: ISiteSection | undefined = configuration?.sections[section.name];

  // setup local state for editing.
  const [enabled, setEnabled] = useState(false);
  const [content, setContent] = useState('');
  const [urls, setUrls] = useState(['']);
  
  const [saving, setSaving] = useState(false);
  const [invalid, setInvalid] = useState(false);

  // reset / init the content when thisSection is set
  const reset = useCallback(() => {
    setEnabled(typeof thisSection?.enabled !== 'undefined' ? thisSection.enabled : false);
    setContent(thisSection?.content || '');
    setUrls(thisSection?.urls || ['']);
  }, [thisSection]);

  useEffect(() => {
    reset();
  }, [reset, configuration]);

  useEffect(() => {
    if (!enabled) {
      setUrls(['']);
    }
  }, [enabled])

  const submit = async (e: FormEvent) => {
    e.preventDefault(); 

    if (enabled && invalid) {      
      return;
    }

    if (configuration) {
      setSaving(true);

      // copy configuration
      const newConfiguration = JSON.parse(JSON.stringify(configuration));

      // create the new section
      const newSection: ISiteSection = {
        enabled,
        content,
        urls,
        props: {
        }
      }

      // spread it out... old first
      newConfiguration.sections = {
        ...newConfiguration.sections,
        [section.name]: {...newSection}
      }

      await saveSite(newConfiguration);
    
      setTimeout(() => setSaving(false), 2000);
    }
  }

  const validateSpotlightUrl = (url: string) => {
    var regExp = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+$/;
    setInvalid(!regExp.test(url));
    setUrls([url]);
  }

  return (
    <form onSubmit={submit} onReset={() => reset()}>
      <div className="flex flex-col gap-4 pb-6 select-none">

        <div className="flex gap-4 items-baseline">
          <span className="text-xl font-semibold text-gray-900">{section.title}</span>
          <span className="text-sm text-gray-600">
            {section.description}
          </span>
        </div>

        <div className="col-span-full flex gap-x-3">
          <div className="flex h-6 items-center">
            <input id="spotlightEnabled" name="spotlightEnabled" type="checkbox"
              checked={enabled} onChange={(e) => setEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div className="text-sm leading-6">
            <label htmlFor="spotlightEnabled" className="font-medium text-gray-900">
              Enable the section
            </label>
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="spotlightContent" className="block text-sm font-medium leading-6 text-gray-900">
            Spotlight Introduction
          </label>
          <div className="mt-2">
            <textarea
              id="spotlightContent" name="spotlightContent" rows={4}
              value={content} onChange={e => setContent(e.target.value)} disabled={!enabled}
              className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 
                ring-inset ring-gray-300 placeholder:text-gray-400 disabled:opacity-30
                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-600 flex gap-6">
            Introduce the spotlight video.
          </p>
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="spotlightUrl" className="block text-sm font-medium leading-6 text-gray-900">
            YouTube Video URL
          </label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 
              focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md relative">
                
              <input required
                disabled={!enabled}
                pattern="https?://.+"
                type="text" name="spotlightUrl" id="spotlightUrl"
                placeholder="https://www.youtube.com/watch?v=qVEOJzAYIW4"
                value={urls} 
                onChange={e => validateSpotlightUrl(e.target.value)} 
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
      </div>

      <ConfigSubmit saving={saving} invalid={invalid}></ConfigSubmit>
    </form>
  )
}