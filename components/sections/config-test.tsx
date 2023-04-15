
import { saveConfig } from "@/services/config";
import { IAppState, useAppStore } from "@/store/app-store";
import { UsersIcon } from "@heroicons/react/24/outline";
import { useState, FormEvent, useEffect, useCallback } from "react";
import ConfigSubmit from "../config-submit";
import { ISection } from "./sections";

export const section: ISection = {
  name: 'test',
  title: 'Test',
  description: 'A test section',
  href: '/sections/test',
  icon: <UsersIcon/>,
  class: 'ml-2 text-xs',
  component: <ConfigTest/>
};

export default function ConfigTest() {

  const configuration = useAppStore((state: IAppState) => state.configuration);
  
  // load this section.
  const thisSection: IBeaconSection | undefined = configuration?.sections[section.name];

  // setup local state for editing.
  const [enabled, setEnabled] = useState(false);
  const [content, setContent] = useState('');

  const [saving, setSaving] = useState(false);
  
  // reset / init the content when thisSection is set
  const reset = useCallback(() => {
    setEnabled(typeof thisSection?.enabled !== 'undefined' ? thisSection.enabled : false);
    setContent(thisSection?.content || '');
  }, [thisSection]);

  useEffect(() => {
    reset();
  }, [reset, configuration]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (configuration) {
      setSaving(true);

      // copy configuration
      const newConfiguration = JSON.parse(JSON.stringify(configuration));

      // create the new section
      const newSection: IBeaconSection = {
        enabled,
        content
      }

      // spread it out... old first
      newConfiguration.sections = {
        ...newConfiguration.sections,
        [section.name]: {...newSection}
      }

      await saveConfig(newConfiguration);

      setTimeout(() => setSaving(false), 2000);
    }    
  }

  return (
    <form onSubmit={submit} onReset={() => reset()}>
      <div className="flex flex-col gap-4 pb-6 select-none">

        <div className="flex gap-4 items-baseline py-4">
          <span className="text-xl font-semibold text-gray-900">{section.title}</span>
          <span className="text-sm text-gray-600">
            {section.description}
          </span>
        </div>
        
        <div className="col-span-full flex gap-x-3">
          <div className="flex h-6 items-center">
            <input id="sectionEnabled" name="sectionEnabled" type="checkbox"
              checked={enabled} onChange={(e) => setEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div className="text-sm leading-6">
            <label htmlFor="sectionEnabled" className="font-medium text-gray-900">
              Enable the section
            </label>
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="funnyContent" className="block text-sm font-medium leading-6 text-gray-900">
            Test Content
          </label>
          <div className="mt-2">
            <textarea
              id="content" name="content" rows={3}
              value={content} 
              onChange={e => setContent(e.target.value)} 
              disabled={!enabled}
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