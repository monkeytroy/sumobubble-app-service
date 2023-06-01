import { saveSite } from "@/services/site";
import { useAppStore } from "@/store/app-store";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useCallback } from "react";
import VerseTranslationSelect from "../verse-translation-select";
import { ISection } from "./sections";
import { ConsoleBody } from "../console-body";

export const section: ISection = {
  name: 'verse',
  title: 'Verse',
  description: 'A custom static or automatic daily verse in the translation of your choice.',
  icon: <BookOpenIcon/>,
  class: 'ml-2 text-xs',
  component: <ConfigVerse/>,
  isInfoSection: true
};

export default function ConfigVerse() {

  // site and editable values  
  const site = useAppStore((state) => state.site);
  const thisSection: ISiteSection | undefined = site?.sections[section.name];

  // setup local state for editing.
  const [enabled, setEnabled] = useState(false);
  const [content, setContent] = useState('');
  const [autoFill, setAutoFill] = useState(true);
  const [verseRef, setVerseRef] = useState('');
  const [translation, setTranslation] = useState('ESV');
  
  // local component state
  const [saving, setSaving] = useState(false);
  const [invalid, setInvalid] = useState(false);

  // reset to site state
  const reset = useCallback(() => {
    setEnabled(!!thisSection?.enabled);
    setContent(thisSection?.content || '');
    setAutoFill(!!thisSection?.props?.autoFill);
    setVerseRef(thisSection?.props?.verseRef || '');
    setTranslation(thisSection?.props?.translation || 'ESV');
  }, [thisSection]);

  // reset to modified site upon changes from state
  useEffect(() => {
    reset();
  }, [reset, site]);

  // save the new site info
  const onSave = async () => {
    if (site) {
      setSaving(true);

      // create the new section
      const newSection: ISiteSection = {
        enabled,
        content,
        props: {
          autoFill,
          verseRef,
          translation
        }
      }

      // save the new site
      await saveSite({
        ...site,
        sections: {
          ...site.sections,
          [section.name]: {...newSection}
        }
      });
    
      setTimeout(() => setSaving(false), 2000);
    }
  }

  const onChangeTranslation = (id: string) => {
    setTranslation(id);
  }

  return (
    <ConsoleBody 
      title={section.title} subTitle={section.description}
      invalid={invalid} saving={saving} 
      onSave={() => onSave()} onCancel={() => reset()}>

      <div className="flex flex-col gap-8">

        <div className="flex gap-3">
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

        <VerseTranslationSelect translation={translation} disabled={!enabled}
          onChangeTranslation={onChangeTranslation}></VerseTranslationSelect>

        <div className="flex gap-3">
          <div className="flex h-6 items-center">
            <input id="verseAuto" name="verseAuto" type="checkbox"
              checked={autoFill} onChange={(e) => setAutoFill(e.target.checked)} disabled={!enabled}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 disabled:opacity-30"
            />
          </div>
          <div className="text-sm leading-6">
            <label htmlFor="verseAuto" className="font-medium text-gray-900">
              Auto Fill <span className="font-normal text-gray-500">- Let Us provide a daily verse.</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="verseRef" className="block text-sm font-medium leading-6 text-gray-900">
            Verse Reference (Psalms 1:1-4)
          </label>
          <div className="">
            <input
              type="text" name="verseRef" id="verseRef"
              value={verseRef} onChange={e => setVerseRef(e.target.value)} disabled={!enabled || autoFill}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm 
                ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 disabled:opacity-30
                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="verseBody" className="block text-sm font-medium leading-6 text-gray-900">
            Verse Body
          </label>
          <div className="">
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

    </ConsoleBody>
  )
}