import { saveSite } from '@/services/site';
import { useAppStore } from '@/store/app-store';
import { ExclamationCircleIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useCallback } from 'react';
import { ISection } from './sections';
import { ConsoleBody } from '@/components/console/console-body';
import { ISiteSection } from '@/models/site';

export const section: ISection = {
  name: 'contact',
  title: 'Contact Us',
  description: 'Contact form with customizable intro.',
  icon: <UsersIcon />,
  class: 'ml-2 text-xs',
  component: <ConfigContact />,
  isInfoSection: true
};

export default function ConfigContact() {
  // site and editable values
  const site = useAppStore((state) => state.site);
  const thisSection: ISiteSection | undefined = site?.sections[section.name];

  // setup local state for editing.
  const [enabled, setEnabled] = useState(false);
  const [content, setContent] = useState('');
  const [email, setEmail] = useState([] as Array<string>);

  // local component state
  const [saving, setSaving] = useState(false);
  const [invalid, setInvalid] = useState(false);

  // reset to site state
  const reset = useCallback(() => {
    setEnabled(!!thisSection?.enabled);
    setContent(thisSection?.content || '');
    setEmail(thisSection?.props?.email || []);
  }, [thisSection]);

  // reset to modified site upon changes from state
  useEffect(() => {
    reset();
  }, [reset, site]);

  // save the new site info
  const onSave = async () => {
    setInvalid(false);
    if (enabled && !email) {
      setInvalid(true);
      return;
    }
    if (site) {
      setSaving(true);

      // create the new section
      const newSection: ISiteSection = {
        enabled,
        content,
        props: {
          email
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

  // validation.  effect on values. Set invalid.
  useEffect(() => {
    setInvalid(enabled && email.length == 0);
  }, [email, enabled]);

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
              id="contactEnabled"
              name="contactEnabled"
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div className="text-sm leading-6">
            <label htmlFor="contactEnabled" className="font-medium text-gray-900">
              Enable this section
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="contact" className="block text-sm font-medium leading-6 text-gray-900">
            Contact Invitation - A message to your users.
          </label>
          <div className="">
            <textarea
              id="contact"
              name="contact"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={!enabled}
              className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 
                ring-inset ring-gray-300 placeholder:text-gray-400 disabled:opacity-30
                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Target email address
          </label>
          <div className="relative">
            <input
              required
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail([e.target.value])}
              disabled={!enabled}
              placeholder="you@example.com"
              aria-invalid={invalid}
              aria-describedby="email-error"
              autoComplete="email"
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
    </ConsoleBody>
  );
}
