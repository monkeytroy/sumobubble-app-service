import { useAppStore } from "@/store/app-store";
import { CogIcon } from "@heroicons/react/24/outline";
import { ISection } from "./sections";
import ConfigSubmit from "../submit-form";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { saveSite } from "@/services/site";
import { TwitterPicker } from "react-color";

export const section: ISection = {
  name: 'setup', 
  title: 'Site Setup',
  description: 'Name, setup, and deploy this site.',
  icon: <CogIcon></CogIcon>,
  class: 'text-sm',
  component: <ConfigSetup/>,
  isInfoSection: false
}

const DEFAULT_THEME_COLOR = '#8ED1FC';
  
const COLORS = [
  '#000000', '#EFEFEF', '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#0039e6', 
  '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', 
  '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B', 
  '#F8BBD0', '#E6EE9C', '#B2DFDB', '#80CBC4', '#BBDEFB', '#90CAF9', '#CE93D8', 
  '#FFAB91', '#BCAAA4'
];

export default function ConfigSetup() {

  const configuration = useAppStore((state: any) => state.site);
  
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [themePrimary, setThemePrimary] = useState(DEFAULT_THEME_COLOR);
  const [pickColor, setPickColor] = useState(false);

  const reset = useCallback(() => {
    setTitle(configuration?.title || '');
    setThemePrimary(configuration?.theme?.primary || DEFAULT_THEME_COLOR);
  }, [configuration]);
  
  useEffect(() => {
    reset();
  }, [reset, configuration]);

  const submit = async (e: FormEvent) => {
    e.preventDefault(); 

    if (configuration) {
      setSaving(true);

      // copy configuration
      const newConfiguration = JSON.parse(JSON.stringify(configuration));

      // set value
      newConfiguration.title = title;
      newConfiguration.theme = {
        primary: themePrimary
      }
      await saveSite(newConfiguration);

      setTimeout(() => setSaving(false), 2000);
    }
  }

  const themeSelect = (color: any) => {
    setThemePrimary(color.hex);
  }

  return (
    <div className="w-1/2 min-w-fit divide-y divide-gray-300">

      <div className="flex flex-col gap-4 pb-8">

        <div className="flex gap-4 items-baseline">
          <span className="text-xl font-semibold text-gray-900">Setup</span>
          <span className="text-sm text-gray-600">
            Get your site setup
          </span>
        </div>

        <form onSubmit={submit} onReset={() => reset()}>
          <div className="flex gap-4 ">
            <div className="flex-grow mb-4">
              <div className="flex flex-col">
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                  Site Title
                </label>
                <div className="mt-2">
                  <input
                    type="text" name="title" id="title"
                    value={title} onChange={e => setTitle(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm 
                      ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                      focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col">
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                  Theme Color
                </label>
                <div className="mt-2 relative">
                  <div className="w-24 h-9 rounded-md" style={{backgroundColor: themePrimary}} 
                    onClick={() => setPickColor(!pickColor)}></div>
                  {pickColor && 
                    <div className="z-50 absolute mt-2 p-4 bg-gradient-to-t from-gray-100 bg-gray-50 border-gray-200 shadow-md shadow-gray-500 rounded-lg ">
                      <TwitterPicker onChangeComplete={themeSelect} colors={COLORS}></TwitterPicker>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          <ConfigSubmit saving={saving}></ConfigSubmit>
        </form>

      </div>
      
      <div className="flex flex-col gap-4 py-8">
        <div className="flex gap-4 items-baseline">
          <span className="text-xl font-semibold text-gray-900">Deploy</span>
          <span className="text-sm text-gray-600">
            Deploy your InfoChat App
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="block text-sm font-medium leading-6 text-gray-900">
            Copy the following code and paste it into your webpage!
          </div>
          <div className="bg-gray-300 rounded-lg shadow-md p-6">
            <pre><code className="">
  {`<script type="module" 
    src="https://app.infochatapp.com/wc/infochat-app.js" 
    id="infochat-app-scriptastic">
  </script>
  <infochat-app site="${configuration?._id}"/>`}
            </code></pre>
          </div>
        </div>
      </div>
    </div>
  )
}