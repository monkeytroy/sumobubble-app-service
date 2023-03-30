
import { Tab } from '@headlessui/react'
import ConfigContact from './config-contact';
import ConfigFunny from './config-funny';
import ConfigSpotlight from './config-spotlight';
import ConfigSummary from './config-summary';
import ConfigVerse from './config-verse';

const ConfigTabs = () => {

  const tabClasses = 'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium focus:outline-none  \
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
      
        <Tab.Panels>
          <Tab.Panel className="py-4"><ConfigSummary></ConfigSummary></Tab.Panel>
          <Tab.Panel className="py-4"><ConfigContact></ConfigContact></Tab.Panel>
          <Tab.Panel className="py-4"><ConfigVerse></ConfigVerse></Tab.Panel>
          <Tab.Panel className="py-4"><ConfigSpotlight></ConfigSpotlight></Tab.Panel>
          <Tab.Panel className="py-4"><ConfigFunny></ConfigFunny></Tab.Panel>
        </Tab.Panels>

    </Tab.Group>
  )
}

export default ConfigTabs;
