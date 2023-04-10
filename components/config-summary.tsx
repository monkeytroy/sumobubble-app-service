//import { PhotoIcon } from "@heroicons/react/24/solid";
import { FormEvent, useEffect, useRef, useState } from 'react';
import ConfigSubmit from '@/components/config-submit';
import { saveConfig } from '@/services/config';
import { TwitterPicker } from 'react-color';
import { IAppState, useAppStore } from '@/store/app-store';
import { Editor } from '@tinymce/tinymce-react';
import ReactHtmlParser from 'react-html-parser';

export default function ConfigSummary() {

  const DEFAULT_THEME_COLOR = '#8ED1FC';
  
  const COLORS = [
    '#000000', '#EFEFEF', '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', 
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', 
    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B', 
    '#F8BBD0', '#E6EE9C', '#B2DFDB', '#80CBC4', '#BBDEFB', '#90CAF9', '#CE93D8', 
    '#FFAB91', '#BCAAA4'
  ];

  const configuration = useAppStore((state: IAppState) => state.configuration);
  const token = useAppStore((state: IAppState) => state.token);

  const [title, setTitle] = useState('');
  const [logo, setLogo] = useState('');
  const [summary, setSummary] = useState('');
  const [special, setSpecial] = useState('');
  const [themePrimary, setThemePrimary] = useState(DEFAULT_THEME_COLOR);

  const [saving, setSaving] = useState(false);
  const [pickColor, setPickColor] = useState(false);
  
  const [summaryLoading, setSummaryLoading] = useState(true);
  const editorRef = useRef({} as any);
  const [dirty, setDirty] = useState(false);
  const [newSummary, setNewSummary] = useState(summary);

  const reset = () => {
    setTitle(configuration?.customer?.title || '');
    setLogo(configuration?.customer?.logo?.url || '');
    setSummary(configuration?.summary?.content || '');
    setNewSummary(configuration?.summary?.content || '');
    setSpecial(configuration?.summary?.special || '');
    setThemePrimary(configuration?.customer?.theme?.primary || DEFAULT_THEME_COLOR)
  }

  useEffect(() => {
    reset();
  }, [configuration]);

  const submit = async (e: FormEvent) => {
    e.preventDefault(); 

    if (configuration && token) {
      setSaving(true);

      // copy configuration
      const newConfiguration = JSON.parse(JSON.stringify(configuration));

      // create new section
      newConfiguration.customer.title = title;
      newConfiguration.customer.logo = { url: logo };
      newConfiguration.summary.content = newSummary;
      newConfiguration.summary.special = special;
      newConfiguration.customer.theme = {
        primary: themePrimary
      }

      await saveConfig(newConfiguration, token);

      setTimeout(() => setSaving(false), 2000);
    }
  }

  const themeSelect = (color: any) => {
    setThemePrimary(color.hex);
  }

  return (
    <form onSubmit={submit} onReset={() => reset()}>
      <div className="flex flex-col gap-6 pb-6 select-none">

        <div className="flex gap-4 items-baseline py-4">
          <span className="text-xl font-semibold text-gray-900">Customer Info</span>
          <span className="text-sm text-gray-600">
            All about your organization!
          </span>
        </div>
          
        <div className="flex gap-4 max-w-full sm:max-w-md w-full">
          <div className="flex-1">
            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
              Title - Pop up heading
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
                <div className="z-50 absolute mt-2 p-4 bg-gradient-to-t from-gray-100 bg-gray-50 border-gray-200 shadow-md shadow-gray-500 rounded-lg ">
                  <TwitterPicker onChangeComplete={themeSelect} colors={COLORS}></TwitterPicker>
                </div>
              }
            </div>
          </div>
        </div>

        <div className="w-full sm:w-full md:w-3/4 hidden">
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

        <div className="flex gap-8">
          <div className="h-160 flex flex-col grow">

            <label htmlFor="summary" className="block text-sm font-medium leading-6 text-gray-900">
              Summary - Summary text
            </label>           

            <div className="mt-2 grow xl:max-w-full w-full max-w-md " >
              {summaryLoading && 
                <div role="status" 
                  className="relative h-full flex flex-col gap-4 animate-pulse border-2 border-gray-200 p-4 rounded-lg">
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px]"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px]"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px]"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px]"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                  
                  <span className="absolute inset-1/2 -mx-6 text-gray-500">Loading...</span>
                </div>
              }

              <Editor
                id="summaryEditor"
                tinymceScriptSrc={'/tinymce/tinymce.min.js'}
                onInit={(evt, editor) => { setSummaryLoading(false); editorRef.current = editor; }}
                initialValue={summary}
                onEditorChange={(newValue, editor) => setNewSummary(newValue)}
                onDirty={() => setDirty(true)}
                init={{
                  resize: false,
                  height: '100%',
                  statusbar: false,
                  menu: {
                    edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace code' },
                    view: { title: 'View', items: '' }, // code visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments
                    insert: { title: 'Insert', items: 'image link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime' },
                    format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat' },
                    tools: { title: 'Tools', items: '' }, // a11ycheck spellcheckerlanguage spellchecker
                    table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
                    help: { title: 'Help', items: 'help' } // help
                  },
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'help', 'emoticons'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor emoticons | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent '
                    //'image media | removeformat code | help'
                }}
              />
            </div>
          </div>

          <div className="h-160 hidden xl:flex flex-col max-w-full sm:max-w-md w-full">
            <label htmlFor="summaryContent" className="block text-sm font-medium leading-6 text-gray-900">
              Summary Preview
            </label>
            
            <div id="summaryContent" className="grow mt-2 overflow-y-auto
              border-2 border-gray-200 p-4 rounded-lg">
              {newSummary && ReactHtmlParser(newSummary)}
            </div>
          </div>
        </div>

        <div className="max-w-full sm:max-w-md w-full">
          <label htmlFor="special" className="block text-sm font-medium leading-6 text-gray-900">
            Special - A highlighted special announcement
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