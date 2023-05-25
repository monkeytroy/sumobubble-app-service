import { saveSite } from "@/services/site";
import { useAppStore, IAppState } from "@/store/app-store";
import { ExclamationCircleIcon, UsersIcon } from "@heroicons/react/24/outline";
import { useState, FormEvent, useEffect, useCallback, useRef } from "react";
import ConfigSubmit from "../config-submit";
import { ISection } from "./sections";

export const section: ISection = {
  name: 'contact',
  title: 'Contact Us',
  description: 'Contact form with customizable intro.',
  route: 'sections/contact',
  icon: <UsersIcon/>,
  class: 'ml-2 text-xs',
  component: <ConfigContact/>
};

export default function ConfigContact() {

  const configuration = useAppStore((state: IAppState) => state.configuration);

  // load this section.
  const thisSection: IBeaconSection | undefined = configuration?.sections[section.name];

  // setup local state for editing.
  const [enabled, setEnabled] = useState(false);
  const [content, setContent] = useState('');
  const [email, setEmail] = useState([] as Array<string>);
  
  const [saving, setSaving] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // reset / init the content when thisSection is set
  const reset = useCallback(() => {
    setEnabled(typeof thisSection?.enabled !== 'undefined' ? thisSection.enabled : false);
    setContent(thisSection?.content || '');
    setEmail(thisSection?.props?.email || []);
  }, [thisSection]);
  
  useEffect(() => {
    reset();
  }, [reset, configuration]);

  const submit = async (e: FormEvent) => {
    e.preventDefault(); 

    setInvalid(false);
    if (enabled && !email) {
      setInvalid(true);
      return;
    }

    if (configuration) {
      setSaving(true);

      // copy configuration
      const newConfiguration = JSON.parse(JSON.stringify(configuration));

      // create the new section
      const newSection: IBeaconSection = {
        enabled,
        content,
        props: {
          email
        }
      }

      // spread it out...  old first
      newConfiguration.sections = {
        ...newConfiguration.sections,
        [section.name]: {...newSection}
      }

      // save!
      await saveSite(newConfiguration);

      setTimeout(() => setSaving(false), 2000);
    }
  }

  useEffect(() => {
    setInvalid(enabled && (email.length == 0 || !formRef.current?.checkValidity()));
  }, [email, enabled])

  return (
    <form onSubmit={submit} onReset={reset} ref={formRef}>
      <div className="flex flex-col gap-6 pb-6 select-none">

        <div className="flex gap-4 items-baseline">
          <span className="text-xl font-semibold text-gray-900">{section.title}</span>
          <span className="text-sm text-gray-600">
            {section.description}
          </span>
        </div>

        <div className="col-span-full flex gap-x-3">
          <div className="flex h-6 items-center">
            <input id="contactEnabled" name="contactEnabled" type="checkbox"
              checked={enabled} onChange={(e) => setEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div className="text-sm leading-6">
            <label htmlFor="comments" className="font-medium text-gray-900">
              Enable this section 
            </label>
          </div>
        </div>
        
        <div className="col-span-full">
          <label htmlFor="contact" className="block text-sm font-medium leading-6 text-gray-900">
            Contact Invitation - A message to your users.
          </label>
          <div className="mt-2">
            <textarea 
              id="contact" name="contact" rows={4}
              value={content} onChange={e => setContent(e.target.value)} disabled={!enabled}
              className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 
                ring-inset ring-gray-300 placeholder:text-gray-400 disabled:opacity-30
                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Target email address(s) - Comma separated
          </label>
          <div className="relative mt-2">
            <input required
              id="email" name="email" type="email"
              value={email} 
              onChange={e => setEmail([e.target.value])} 
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

      <ConfigSubmit saving={saving} invalid={invalid}></ConfigSubmit>
        
    </form>
  )
}