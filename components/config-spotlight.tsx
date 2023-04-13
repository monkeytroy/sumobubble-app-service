import { saveConfig } from "@/services/config";
import { IAppState, useAppStore } from "@/store/app-store";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useState, FormEvent, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import ConfigSubmit from "./config-submit";

export default function ConfigSpotlight() {

  const configuration = useAppStore((state: IAppState) => state.configuration);

  const spotlight: IBeaconSection | undefined = configuration?.sections?.spotlight;

  //const [title, setTitle] = useState(contact?.title);
  const [enabled, setEnabled] = useState(false);
  const [content, setContent] = useState('');
  const [urls, setUrls] = useState(['']);
  const [urlsValid, setUrlsValid] = useState(true);
  
  const [saving, setSaving] = useState(false);
  
  const reset = useCallback(() => {
    setEnabled(spotlight?.enabled || false);
    setContent(spotlight?.content || '');
    setUrls(spotlight?.urls || ['']);
  }, [spotlight]);

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

    if (enabled && !urlsValid) {
      toast.error('Bad link for YouTube video.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      return;
    }

    if (configuration) {
      setSaving(true);

      // copy configuration
      const newConfiguration = JSON.parse(JSON.stringify(configuration));

      // create the new section
      const spotlight: IBeaconSection = {
        //title,
        enabled,
        content,
        urls,
        props: {
        }
      }

      // spread it out... old first
      newConfiguration.sections = {
        ...newConfiguration.sections,
        spotlight: {...spotlight}
      }

      await saveConfig(newConfiguration);
    
      setTimeout(() => setSaving(false), 2000);
    }
  }

  const validateSpotlightUrl = (url: string) => {
    var regExp = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+$/;
    if (!regExp.test(url)) {
      setUrlsValid(false);
    } else {
      setUrlsValid(true);
    }
    setUrls([url]);
  }

  return (
    <form onSubmit={submit} onReset={() => reset()}>
      <div className="flex flex-col gap-4 pb-6 select-none">

        <div className="flex gap-4 items-baseline py-4">
          <span className="text-xl font-semibold text-gray-900">Spotlight</span>
          <span className="text-sm text-gray-600">
            A video to highlight to your guests.
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
                {!urlsValid && 
                  <div className="absolute top-0 bottom-0 right-1 select-none text-red-500 flex flex-col items-center justify-center">
                    <ExclamationTriangleIcon className="w-6 h-6"></ExclamationTriangleIcon>
                  </div>
                }
              <input type="text" name="spotlightUrl" id="spotlightUrl"
                value={urls} onChange={e => validateSpotlightUrl(e.target.value)} disabled={!enabled}
                className="block flex-1 border-0 bg-transparent py-1.5 px-2 text-gray-900 disabled:opacity-30
                  placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 mr-6 "
                placeholder="https://www.youtube.com/watch?v=qVEOJzAYIW4"
              />
            </div>
          </div>
        </div>
      </div>

      <ConfigSubmit saving={saving}></ConfigSubmit>
    </form>
  )
}