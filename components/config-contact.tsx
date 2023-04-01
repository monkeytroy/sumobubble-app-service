import { IAppProps, useAppStore } from "@/pages";
import { saveConfig } from "@/services/config";
import { useState, FormEvent, useEffect } from "react";
import ConfigSubmit from "./config-submit";

export default function ConfigContact(props: IAppProps) {

  const contact: IBeaconSection | undefined = props?.configuration?.sections?.contact;

  //const [title, setTitle] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  
  const [saving, setSaving] = useState(false);
  const refresh = useAppStore((state: any) => state.refresh);

  const reset = () => {
    setEnabled(typeof contact?.enabled !== 'undefined' ? contact.enabled : false);
    setContent(contact?.content || '');
    setEmail(contact?.props.email || '');
  }
  const inc = useAppStore((state: any) => state.inc);
  setTimeout(inc, 1000);
  
  useEffect(() => {
    reset();
  },[]);

  const submit = async (e: FormEvent) => {
    e.preventDefault(); 
    setSaving(true);

    // copy configuration
    const configuration = {...props.configuration};

    // create the new section
    const contact: IBeaconSection = {
      //title,
      enabled,
      content,
      props: {
        email
      }
    }

    // spread it out...  old first
    configuration.sections = {
      ...configuration.sections,
      contact: {...contact}
    };

    // save!
    await saveConfig(configuration, props.token);
    refresh();
    
    setTimeout(() => setSaving(false), 2000);
  }

  return (
    <form onSubmit={submit} onReset={reset}>
      <div className="flex flex-col gap-4 pb-8 border-b border-gray-900/10  select-none">

        <div className="flex gap-4 items-baseline py-4">
          <span className="text-xl font-semibold text-gray-900">Contact</span>
          <span className="text-sm text-gray-600">
            Configure the Contact Panel
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
              Enable
            </label>
            <p className="text-gray-500">Enable / Disable this section.</p>
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
          <p className="mt-3 text-sm leading-6 text-gray-600 flex gap-6">
            Invite your guest to contact you.
          </p>
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Target email address(s) - Comma separated
          </label>
          <div className="mt-2">
            <input
              id="email" name="email" type="email"
              value={email} onChange={e => setEmail(e.target.value)} disabled={!enabled}
              autoComplete="email"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm 
                ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 disabled:opacity-30
                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

      <ConfigSubmit saving={saving}></ConfigSubmit>
        
    </form>
  )
}