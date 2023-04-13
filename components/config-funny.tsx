
import { saveConfig } from "@/services/config";
import { IAppState, useAppStore } from "@/store/app-store";
import { useState, FormEvent, useEffect } from "react";
import ConfigSubmit from "./config-submit";

export default function ConfigFunny() {

  const configuration = useAppStore((state: IAppState) => state.configuration);
  
  const funny: IBeaconSection | undefined = configuration?.sections?.funny;

  //const [title, setTitle] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [autoFill, setAutoFill] = useState(false);
  const [content, setContent] = useState('');
  const [urls, setUrls] = useState(['']);
  
  const [saving, setSaving] = useState(false);
    
  const reset = () => {
    setEnabled(funny?.enabled || false);
    setAutoFill(typeof funny?.props?.autoFill !== 'undefined' ? funny?.props.autoFill : false);
    setContent(funny?.content || '');
    setUrls(funny?.urls || ['']);
  }

  useEffect(() => {
    reset();
  }, [configuration]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (configuration) {

      setSaving(true);

      // copy configuration
      const newConfiguration = JSON.parse(JSON.stringify(configuration));

      // create the new section
      const funny: IBeaconSection = {
        //title,
        enabled,
        content,
        urls,
        props: {
          autoFill
        }
      }

      // spread it out... old first
      newConfiguration.sections = {
        ...newConfiguration.sections,
        funny: {...funny}
      }

      await saveConfig(newConfiguration);

      setTimeout(() => setSaving(false), 2000);
    }    
  }

  return (
    <form onSubmit={submit} onReset={() => reset()}>
      <div className="flex flex-col gap-4 pb-6 select-none">

        <div className="flex gap-4 items-baseline py-4">
          <span className="text-xl font-semibold text-gray-900">Daily Funny</span>
          <span className="text-sm text-gray-600">
            An automatic or personal funny of the day.
          </span>
        </div>
        
        <div className="col-span-full flex gap-x-3">
          <div className="flex h-6 items-center">
            <input id="funnyEnabled" name="funnyEnabled" type="checkbox"
              checked={enabled} onChange={(e) => setEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div className="text-sm leading-6">
            <label htmlFor="funnyEnabled" className="font-medium text-gray-900">
              Enable the section
            </label>
          </div>
        </div>

        <div className="col-span-full flex gap-x-3">
          <div className="flex h-6 items-center">
            <input id="autoFill" name="funnyAuto" type="checkbox"
              checked={autoFill} onChange={(e) => setAutoFill(e.target.checked)} disabled={!enabled}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 disabled:opacity-30"
            />
          </div>
          <div className="text-sm leading-6">
            <label htmlFor="funnyAuto" className="font-medium text-gray-900">
              Auto Fill
            </label>
            <p className="text-gray-500">Let Beacon provide a daily funny.</p>
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="funnyContent" className="block text-sm font-medium leading-6 text-gray-900">
            YOU Tell a Joke
          </label>
          <div className="mt-2">
            <textarea
              id="funnyContent" name="funnyContent" rows={4}
              value={content} onChange={e => setContent(e.target.value)} disabled={!enabled || autoFill}
              className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 
                ring-inset ring-gray-300 placeholder:text-gray-400 disabled:opacity-30
                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-600 flex gap-6">
            Each line will be displayed after a short delay.
          </p>
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="memeUrl" className="block text-sm font-medium leading-6 text-gray-900">
            YOU Share a meme
          </label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 
              focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">https://</span>
              <input type="text" name="memeUrl" id="memeUrl"
                value={urls} onChange={e => setUrls([e.target.value])} disabled={!enabled || autoFill}
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 disabled:opacity-30
                  placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="https://some-image-url.com"
              />
            </div>
          </div>
        </div>
      </div>
      <ConfigSubmit saving={saving}></ConfigSubmit>
    </form>
  )
}