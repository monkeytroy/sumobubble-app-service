import { Tab } from '@headlessui/react'
import ConfigContact from './config-contact';
import ConfigFunny from './config-funny';
import ConfigSpotlight from './config-spotlight';
import ConfigSummary from './config-summary';
import ConfigVerse from './config-verse';

export interface Notification {
  id?: string;
  type: string;
  timeout: number;
  text: string;
}

const ConfigTabs = () => {

  const tabClasses = 'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium \
    focus: border-6 focus:outline-none  \
    ui-selected:border-indigo-500 ui-selected:text-indigo-600 \
    ui-not-selected:border-transparent ui-not-selected:hover:border-gray-300 ui-not-selected:text-gray-700';

  return (
    <Tab.Group>

        <Tab.List className="flex space-x-8 border-b border-gray-200">
          <Tab className={tabClasses}>Summary</Tab>
          <Tab className={tabClasses}>Contact</Tab>
          <Tab className={tabClasses}>Verse</Tab>
          <Tab className={tabClasses}>Spotlight</Tab>
          <Tab className={tabClasses}>Funny</Tab>
        </Tab.List>
      
        <Tab.Panels className="">
          <Tab.Panel className="py-4 focus:outline-none"><ConfigSummary></ConfigSummary></Tab.Panel>
          <Tab.Panel className="py-4 focus:outline-none"><ConfigContact></ConfigContact></Tab.Panel>
          <Tab.Panel className="py-4 focus:outline-none"><ConfigVerse></ConfigVerse></Tab.Panel>
          <Tab.Panel className="py-4 focus:outline-none"><ConfigSpotlight></ConfigSpotlight></Tab.Panel>
          <Tab.Panel className="py-4 focus:outline-none"><ConfigFunny></ConfigFunny></Tab.Panel>
        </Tab.Panels>

    </Tab.Group>
  )
}

export default ConfigTabs;
