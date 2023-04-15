import { saveConfig } from "@/services/config";
import { useAppStore, IAppState } from "@/store/app-store";
import { ExclamationCircleIcon, MinusCircleIcon, StarIcon } from "@heroicons/react/24/outline";
import { useState, FormEvent, useEffect, useCallback, useRef } from "react";
import ConfigSubmit from "../config-submit";
import { ISection } from "./sections";

export const section: ISection = {
  name: 'prayer',
  title: 'Prayer Request',
  description: 'Contact form specifically for prayer requests.',
  href: '/sections/prayer',
  icon: <StarIcon/>,
  class: 'ml-2 text-xs',
  component: <ConfigPrayer/>
};

export default function ConfigPrayer() {

  const configuration = useAppStore((state: IAppState) => state.configuration);

  // load this section.
  const thisSection: IBeaconSection | undefined = configuration?.sections[section.name];

  // setup local state for editing.
  const [enabled, setEnabled] = useState(false);
  const [content, setContent] = useState('');
  const [email, setEmail] = useState([] as Array<string>);
  const [categories, setCategories] = useState([] as Array<IContactCategory>);

  const [newCategory, setNewCategory] = useState('');
  const [newCategoryEmail, setNewCategoryEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // reset / init the content when thisSection is set
  const reset = useCallback(() => {
    setEnabled(typeof thisSection?.enabled !== 'undefined' ? thisSection.enabled : false);
    setContent(thisSection?.content || '');
    setEmail(thisSection?.props?.email || []);
    setCategories(thisSection?.props?.categories || []);
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
          email,
          categories: Array.from(categories)
        }
      }

      // spread it out...  old first
      newConfiguration.sections = {
        ...configuration.sections,
        [section.name]: {...newSection}
      };

      // save!
      await saveConfig(newConfiguration);
 
      setTimeout(() => setSaving(false), 2000);
    }
  }

  useEffect(() => {
    setInvalid(enabled && (email.length == 0 || !formRef.current?.checkValidity()));
  }, [email, enabled])

  /**
   * Add a new category duh
   * @returns 
   */
  const addNewCategory = () => {

    if (categories.filter((cat) => cat.title === newCategory).length == 1) {
      // show some error 
      return;
    }

    setCategories([
      ...categories,
      {
        title: newCategory,
        email: newCategoryEmail
      }
    ]);

    setNewCategory('');
    setNewCategoryEmail('');
  }

  const removeCategory = (catTitle: string) => {
    setCategories(categories.filter((cat) => cat.title !== catTitle));
  }
  
  return (
    <form onSubmit={submit} onReset={reset} ref={formRef}>
      <div className="flex flex-col gap-6 pb-6 select-none">

        <div className="flex gap-4 items-baseline py-4">
          <span className="text-xl font-semibold text-gray-900">{section.title}</span>
          <span className="text-sm text-gray-600">
            {section.description}
          </span>
        </div>

        <div className="col-span-full flex gap-x-3">
          <div className="flex h-6 items-center">
            <input id="prayerEnabled" name="prayerEnabled" type="checkbox"
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
        
        <div className="">
          <label htmlFor="contact" className="block text-sm font-medium leading-6 text-gray-900">
            Invitation - A message to your users.
          </label>
          <div className="mt-2">
            <textarea 
              id="content" name="content" rows={3}
              value={content} 
              onChange={e => setContent(e.target.value)} disabled={!enabled}
              className="disabled:opacity-30
                block w-full rounded-md border-0 text-gray-900 shadow-sm 
                ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Default email address - Used if a category is not selected by the user. 
          </label>
          <div className="relative mt-2">
            <input required
              id="email" name="email" type="email"
              value={email} 
              onChange={e => setEmail(e.target.value ? [e.target.value.trim()] : [])} 
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

        <div>
          <label htmlFor="contact" 
            className="block text-sm font-medium leading-6 text-gray-900">
              Prayer Categories
          </label>
        
          <div className="mt-2 rounded-md border border-gray-300 shadow-sm flex flex-wrap divide-x divide-gray-300">
            
            <div className="p-4 flex flex-col gap-4 w-1/2 min-w-fit">
              <div className="">
                <label htmlFor="catName" className="block text-sm font-medium leading-6 text-gray-900">
                  Category
                </label>
                <div className="mt-2">
                  <input
                    id="category" name="category" type="text"
                    value={newCategory} 
                    onChange={e => setNewCategory(e.target.value)} 
                    disabled={!enabled}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm 
                      ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 disabled:opacity-30
                      focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Target email address(s) - Comma separated
                </label>
                <div className="mt-2">
                  <input
                    id="email" name="email" type="email"
                    value={newCategoryEmail} 
                    onChange={e => setNewCategoryEmail(e.target.value)} 
                    disabled={!enabled}
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm 
                      ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 disabled:opacity-30
                      focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <button type="button" onClick={addNewCategory}
                disabled={!enabled}
                className="rounded-md bg-indigo-600 p-1 text-white shadow-sm 
                  hover:bg-indigo-500 focus-visible:outline disabled:opacity-30
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Add
              </button>
            </div>

            <div className="p-4">

              <label htmlFor="contact" 
                className="block text-sm font-medium leading-6 text-gray-900">
                  Selected Categories ({categories.length})
              </label>

              <ul role="list" className="">
                {categories.length == 0 && 
                  <div className="opacity-30 flex py-2">
                    <button type="button" 
                      className="rounded-full text-gray-600
                        focus-visible:bg-indigo-200 focus-visible:ring-0 focus-visible:ring-offset-0
                        focus-visible:outline-0">
                      <MinusCircleIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Some Category</p>
                      <p className="text-sm text-gray-500">someone@somewhere.com</p>
                    </div>           
                  </div>
                }
                {categories.map((cat) => (
                  <li key={cat.title} className="flex py-2">
                    <button type="button" 
                      onClick={() => removeCategory(cat.title)}
                      disabled={!enabled}
                      className="rounded-full text-gray-600 disabled:opacity-30
                        focus-visible:bg-indigo-200 focus-visible:ring-0 focus-visible:ring-offset-0
                        focus-visible:outline-0">
                      <MinusCircleIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{cat.title}</p>
                      <p className="text-sm text-gray-500">{cat.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>        
      </div>

      <ConfigSubmit saving={saving} invalid={invalid}></ConfigSubmit>
        
    </form>
  )
}