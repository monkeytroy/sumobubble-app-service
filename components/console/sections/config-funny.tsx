import { saveSite } from '@/services/site';
import { useAppStore } from '@/store/app-store';
import { FaceSmileIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useCallback, useRef } from 'react';
import { ISection } from './sections';
import { ConsoleBody } from '@/components/console/console-body';
import { ISiteSection } from '@/models/site';

export const section: ISection = {
  name: 'funny',
  title: 'Daily Funny',
  description: 'A custom or automatic daily funny item!',
  icon: <FaceSmileIcon />,
  class: 'ml-2 text-xs',
  component: <ConfigFunny />,
  isInfoSection: true
};

export default function ConfigFunny() {
  // site and editable values
  const site = useAppStore((state) => state.site);
  const thisSection: ISiteSection | undefined = site?.sections[section.name];

  // setup local state for editing.
  const [title, setTitle] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [autoFill, setAutoFill] = useState(false);
  const [content, setContent] = useState('');
  const [urls, setUrls] = useState(['']);

  // local component state
  const [saving, setSaving] = useState(false);
  const [invalid, setInvalid] = useState(false);

  // reset to site state
  const reset = useCallback(() => {
    setTitle(thisSection?.title || '');
    setEnabled(!!thisSection?.enabled);
    setAutoFill(!!thisSection?.props?.autoFill);
    setContent(thisSection?.content || '');
    setUrls(thisSection?.urls || ['']);
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
        title,
        content,
        urls,
        props: {
          autoFill
        }
      };

      // save the new site
      await saveSite({
        ...site,
        sections: {
          ...site.sections,
          [section.name]: { ...newSection }
        }
      });

      setTimeout(() => setSaving(false), 2000);
    }
  };

  return (
    <ConsoleBody
      title={section.title}
      subTitle={section.description}
      invalid={invalid}
      saving={saving}
      onSave={() => onSave()}
      onCancel={() => reset()}>
      <div className="flex flex-col gap-8">
        <div className="flex gap-3">
          <div className="flex h-6 items-center">
            <input
              id="funnyEnabled"
              name="funnyEnabled"
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div className="text-sm leading-6">
            <label htmlFor="funnyEnabled" className="font-medium text-gray-900">
              Enable the section
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex h-6 items-center">
            <input
              id="autoFill"
              name="autoFill"
              type="checkbox"
              checked={autoFill}
              onChange={(e) => setAutoFill(e.target.checked)}
              disabled={!enabled}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 disabled:opacity-30"
            />
          </div>
          <div className="text-sm leading-6">
            <label htmlFor="autoFill" className="font-medium text-gray-900">
              Auto Fill
            </label>
            <p className="text-gray-500">Let Us provide a daily funny.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="funnyContent" className="block text-sm font-medium leading-6 text-gray-900">
            YOU Tell a Joke
          </label>
          <div className="">
            <textarea
              id="funnyContent"
              name="funnyContent"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={!enabled || autoFill}
              className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 
                ring-inset ring-gray-300 placeholder:text-gray-400 disabled:opacity-30
                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-600 flex gap-6">
            Each line will be displayed after a short delay.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="memeUrl" className="block text-sm font-medium leading-6 text-gray-900">
            YOU Share a meme
          </label>
          <div className="">
            <div
              className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 
              focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">https://</span>
              <input
                type="text"
                name="memeUrl"
                id="memeUrl"
                value={urls}
                onChange={(e) => setUrls([e.target.value])}
                disabled={!enabled || autoFill}
                placeholder="https://some-image-url.com"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 disabled:opacity-30
                  placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </div>
    </ConsoleBody>
  );
}
