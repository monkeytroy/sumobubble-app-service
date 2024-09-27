import { useAppStore } from '@/store/app-store';
import { CogIcon } from '@heroicons/react/24/outline';
import { ISection } from './sections';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { saveSite } from '@/services/site';
import { TwitterPicker } from 'react-color';
import { ConsoleBody } from '../console-body';
import { formClass } from '@/constants/form-class';
import { SubscriptionStatus } from '@/models/customer';
import ConsolePricing from '../console-pricing';
import { IAppProps } from '@/services/ssp-default';

export const section: ISection = {
  name: 'setup',
  title: 'Site Setup',
  description: 'Name, setup, and deploy this site.',
  icon: <CogIcon></CogIcon>,
  class: 'text-sm',
  component: <ConfigSetup />,
  isInfoSection: false
};

const DEFAULT_THEME_COLOR = '#8ED1FC';

const TITLE_LEN_MAX = 160;
const TITLE_LEN_MIN = 4;

const COLORS = [
  '#000000',
  '#EFEFEF',
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#0039e6',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#FFC107',
  '#FF9800',
  '#FF5722',
  '#795548',
  '#9E9E9E',
  '#607D8B',
  '#F8BBD0',
  '#E6EE9C',
  '#B2DFDB',
  '#80CBC4',
  '#BBDEFB',
  '#90CAF9',
  '#CE93D8',
  '#FFAB91',
  '#BCAAA4'
];

export default function ConfigSetup(props: IAppProps) {
  // site and editable values
  const site = useAppStore((state: any) => state.site);
  const customer = useAppStore((state: any) => state.customer);

  const [title, setTitle] = useState('');
  const [themePrimary, setThemePrimary] = useState(DEFAULT_THEME_COLOR);
  const [button, setButton] = useState('');

  // local component state
  const [showPickColor, setShowPickColor] = useState(false);
  const [saving, setSaving] = useState(false);
  const [invalid, setInvalid] = useState(false);

  // reset to site state
  const reset = useCallback(() => {
    setButton(site?.button || '');
    setTitle(site?.title || '');
    setThemePrimary(site?.theme?.primary || DEFAULT_THEME_COLOR);
  }, [site]);

  // reset to modified site upon changes from state
  useEffect(() => {
    reset();
  }, [reset, site]);

  // save the new site info.
  const onSave = async () => {
    if (site) {
      setSaving(true);
      await saveSite({ ...site, title: title, theme: { primary: themePrimary }, button });
      setTimeout(() => setSaving(false), 1000);
    }
  };

  // validation.  effect on values. Set invalid.
  useEffect(() => {
    setInvalid(title.length < TITLE_LEN_MIN || title.length > TITLE_LEN_MAX);
  }, [title]);

  // more component support.

  // set theme when color is changed.
  const themeSelect = (color: any) => {
    setThemePrimary(color.hex);
    setShowPickColor(false);
  };

  return (
    <ConsoleBody
      title="Setup"
      subTitle="Get your site setup"
      invalid={invalid}
      saving={saving}
      onSave={() => onSave()}
      onCancel={() => reset()}>
      <div className="divide-y divide-gray-300">
        <div className="flex flex-col gap-4 pb-8">
          <div className="flex gap-4 ">
            <div className="flex-grow mb-4">
              <div className="flex flex-col">
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                  Site Title
                </label>
                <div className="mt-2">
                  <input
                    required
                    title="Site title requires 4 or more characters."
                    minLength={TITLE_LEN_MIN}
                    maxLength={TITLE_LEN_MAX}
                    aria-invalid={invalid}
                    type="text"
                    name="title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={formClass}
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
                  <div
                    className="w-24 h-9 rounded-md"
                    style={{ backgroundColor: themePrimary }}
                    onClick={() => setShowPickColor(!showPickColor)}></div>
                  {showPickColor && (
                    <div className="z-50 absolute mt-2 p-4 bg-gradient-to-t from-gray-100 bg-gray-50 border-gray-200 shadow-md shadow-gray-500 rounded-lg ">
                      <TwitterPicker onChangeComplete={themeSelect} colors={COLORS}></TwitterPicker>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Button Style</label>
            <p className="text-sm text-gray-500">How would you like InfoChat button to appear?</p>
            <fieldset className="mt-4">
              <legend className="sr-only">Select</legend>
              <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                <div className="flex items-center">
                  <input
                    id="buttonCircle"
                    name="notification-method"
                    type="radio"
                    defaultChecked={button == 'circleRight'}
                    onClick={() => setButton('circleRight')}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor="buttonCircle" className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                    Circle Button
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="buttonRight"
                    name="notification-method"
                    type="radio"
                    defaultChecked={button == '' || button == 'right'}
                    onClick={() => setButton('right')}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor="buttonRight" className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                    Right Edge
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-8">
          <div className="flex gap-4 items-baseline">
            <span className="text-xl font-semibold text-gray-900">Deploy</span>
            <span className="text-sm text-gray-600">Deploy your InfoChat App</span>
          </div>

          {customer?.subscription?.status != SubscriptionStatus.Active && (
            <div className="text-lg text-gray-600 mt-4 flex flex-col gap-4">
              Subscribe to deploy InfoChat App to your webiste.
              <div className="">
                <ConsolePricing {...props} startClosed={true}></ConsolePricing>
              </div>
            </div>
          )}
          {customer?.subscription?.status == SubscriptionStatus.Active && (
            <div className="flex flex-col gap-2">
              <div className="block text-sm font-medium leading-6 text-gray-900">
                Copy the following code and paste it into your webpage!
              </div>
              <div className="bg-gray-300 rounded-lg shadow-md p-6 select-text break-all whitespace-pre-wrap">
                <code>
                  {`<script type="module" 
  src="https://sumobubble-app-bukyz.ondigitalocean.app//wc/app/sumobubble-app.js" 
  id="sumobubble-scriptastic">
  </script>
  <sumobubble site="${site?._id}"></sumobubble>`}
                </code>
              </div>
            </div>
          )}
        </div>
      </div>
    </ConsoleBody>
  );
}
