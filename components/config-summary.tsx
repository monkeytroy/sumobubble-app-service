//import { PhotoIcon } from "@heroicons/react/24/solid";
import { FormEvent, useEffect, useState } from "react";
import ConfigSubmit from "@/components/config-submit";
import { IAppProps, useAppStore } from "@/pages";
import { saveConfig } from "@/services/config";
import { TwitterPicker } from 'react-color';

export default function ConfigSummary(props: IAppProps) {

  const DEFAULT_THEME_COLOR = '#8ED1FC';
  
  const COLORS = [
    '#000000', '#EFEFEF', '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', 
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', 
    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B', 
    '#F8BBD0', '#E6EE9C', '#B2DFDB', '#80CBC4', '#BBDEFB', '#90CAF9', '#CE93D8', 
    '#FFAB91', '#BCAAA4'
  ];

  const [title, setTitle] = useState('');
  const [logo, setLogo] = useState('');
  const [summary, setSummary] = useState('');
  const [special, setSpecial] = useState('');
  const [themePrimary, setThemePrimary] = useState(DEFAULT_THEME_COLOR);

  const [saving, setSaving] = useState(false);
  const [pickColor, setPickColor] = useState(false);
  const refresh = useAppStore((state: any) => state.refresh);
  
  const reset = () => {
    setTitle(props.configuration.customer?.title || '');
    setLogo(props.configuration.customer?.logo?.url || '');
    setSummary(props.configuration.summary?.content || '');
    setSpecial(props.configuration.summary?.special || '');
    setThemePrimary(props.configuration.customer.theme?.primary || DEFAULT_THEME_COLOR)
  }

  useEffect(() => {
    reset();
  },[]);

  const submit = async (e: FormEvent) => {
    e.preventDefault(); 
    setSaving(true);

    // copy configuration
    const configuration = JSON.parse(JSON.stringify(props.configuration));

    // create new section
    configuration.customer.title = title;
    configuration.customer.logo = { url: logo };
    configuration.summary.content = summary;
    configuration.summary.special = special;
    configuration.customer.theme = {
      primary: themePrimary
    }

    await saveConfig(configuration, props.token);
    refresh();

    setTimeout(() => setSaving(false), 2000);
  }

  const themeSelect = (color: any) => {
    setThemePrimary(color.hex);
  }

  return (
    <form onSubmit={submit} onReset={() => reset()}>
      <div className="flex flex-col gap-4 pb-8 border-b border-gray-900/10  select-none">

        <div className="flex gap-4 items-baseline py-4">
          <span className="text-xl font-semibold text-gray-900">Customer Info</span>
          <span className="text-sm text-gray-600">
            All about your organization!
          </span>
        </div>
          
        <div className="flex gap-4 w-full sm:w-full md:w-3/4">
          <div className="flex-1">
            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
              Title - Text in the Beacon header
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

          <div className="md:grow-1 sm:shrink">
            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
              Theme Color
            </label>
            <div className="mt-2 relative">
              <div className="w-24 h-9 rounded-md" style={{backgroundColor: themePrimary}} 
                onClick={() => setPickColor(!pickColor)}></div>
              {pickColor && 
                <div className="absolute mt-2 p-4 bg-gradient-to-t from-gray-100 bg-gray-50 border-gray-200 shadow-md shadow-gray-500 rounded-lg ">
                  <TwitterPicker onChangeComplete={themeSelect} colors={COLORS}></TwitterPicker>
                </div>
              }
            </div>
          </div>
        </div>

        <div className="w-full sm:w-full md:w-3/4">
          <label htmlFor="logo" className="block text-sm font-medium leading-6 text-gray-900">
            Logo - URL to a logo appearing at the top of the summary.
          </label>
          <div className="mt-2">
            <input
              type="text" name="logo" id="logo"
              value={logo} onChange={e => setLogo(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm 
                ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>        

        <div className="col-span-full">
          <label htmlFor="summary" className="block text-sm font-medium leading-6 text-gray-900">
            Summary - Summary text always displayed first! (Supports some markdown syntax)
          </label>
          <div className="mt-2">
            <textarea
              id="summary" name="summary" rows={4}
              value={summary} onChange={e => setSummary(e.target.value)}
              className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 
                ring-inset ring-gray-300 placeholder:text-gray-400 
                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-600 flex gap-6">
            <span>**Bold**</span>
            <span>[Link Text](https://full-url.com)</span>
            <span>\n\n = New Line</span>
          </p>
        </div>

        <div className="col-span-full">
          <label htmlFor="summary" className="block text-sm font-medium leading-6 text-gray-900">
            Special - A highlighted special announcement (Supports some markdown syntax)
          </label>
          <div className="mt-2">
            <textarea
              id="special" name="special" rows={3}
              value={special} onChange={e => setSpecial(e.target.value)}
              className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 
                ring-inset ring-gray-300 placeholder:text-gray-400 
                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

      </div>
    
      <ConfigSubmit saving={saving}></ConfigSubmit>

    </form>
  )
}