import { saveConfig } from "@/services/config";
import { IAppState, useAppStore } from "@/store/app-store";
import { useState, FormEvent, useEffect } from "react";
import ConfigSubmit from "./config-submit";
import VerseTranslationSelect from "./verse-translation-select";

export default function ConfigVerse() {

  const configuration = useAppStore((state: IAppState) => state.configuration);

  const verse: IBeaconSection | undefined = configuration?.sections?.verse;

  //const [title, setTitle] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [content, setContent] = useState('');
  const [autoFill, setAutoFill] = useState(true);
  const [verseRef, setVerseRef] = useState('');
  const [translation, setTranslation] = useState('ESV');
  
  const [saving, setSaving] = useState(false);
  
  const reset = () => {
    setEnabled(typeof verse?.enabled !== 'undefined' ? verse?.enabled : false);
    setContent(verse?.content || '');
    setAutoFill(typeof verse?.props?.autoFill !== 'undefined' ? verse?.props?.autoFill : true);
    setVerseRef(verse?.props?.verseRef || '');
    setTranslation(verse?.props?.translation || 'ESV');
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
      const verse: IBeaconSection = {
        //title,
        enabled,
        content,
        props: {
          autoFill,
          verseRef,
          translation
        }
      }

      // spread it out... old first
      newConfiguration.sections = {
        ...newConfiguration.sections,
        verse: {...verse}      
      }

      // save!
      await saveConfig(newConfiguration);
    
      setTimeout(() => setSaving(false), 2000);
    }
  }

  const onChangeTranslation = (id: string) => {
    setTranslation(id);
  }

  return (
    <form onSubmit={submit} onReset={reset}>
      <div className="flex flex-col gap-4 pb-6 select-none">

        <div className="flex gap-4 items-baseline py-4">
          <span className="text-xl font-semibold text-gray-900">Daily Verse</span>
          <span className="text-sm text-gray-600">
            An automatic or personal verse of the day in the translation of your choice.
          </span>
        </div>

        <div className="col-span-full flex gap-x-3">
          <div className="flex h-6 items-center">
            <input id="verseEnabled" name="verseEnabled" type="checkbox"
              checked={enabled} onChange={(e) => setEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div className="text-sm leading-6">
            <label htmlFor="verseEnabled" className="font-medium text-gray-900">
              Enable the section
            </label>
          </div>
        </div>

        <div className="sm:col-span-4">
            <VerseTranslationSelect translation={translation} disabled={!enabled}
              onChangeTranslation={onChangeTranslation}></VerseTranslationSelect>
        </div>

        <div className="col-span-full flex gap-x-3">
          <div className="flex h-6 items-center">
            <input id="verseAuto" name="verseAuto" type="checkbox"
              checked={autoFill} onChange={(e) => setAutoFill(e.target.checked)} disabled={!enabled}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 disabled:opacity-30"
            />
          </div>
          <div className="text-sm leading-6">
            <label htmlFor="verseAuto" className="font-medium text-gray-900">
              Auto Fill <span className="font-normal text-gray-500">- Let Beacon provide a daily verse.</span>
            </label>
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="verseRef" className="block text-sm font-medium leading-6 text-gray-900">
            Verse Reference (Psalms 1:1-4)
          </label>
          <div className="mt-2">
            <input
              type="text" name="verseRef" id="verseRef"
              value={verseRef} onChange={e => setVerseRef(e.target.value)} disabled={!enabled || autoFill}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm 
                ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 disabled:opacity-30
                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="verseBody" className="block text-sm font-medium leading-6 text-gray-900">
            Verse Body
          </label>
          <div className="mt-2">
            <textarea
              id="verseBody" name="verseBody" rows={4}
              value={content} onChange={e => setContent(e.target.value)} disabled={!enabled || autoFill}
              className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 
                ring-inset ring-gray-300 placeholder:text-gray-400 disabled:opacity-30
                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

      <ConfigSubmit saving={saving}></ConfigSubmit>
    </form>
  )
}