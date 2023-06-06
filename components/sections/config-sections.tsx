import { useAppStore } from '@/store/app-store';
import { ISection, sections } from '@/components/sections/sections';
import Link from 'next/link';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { ConsoleBody } from '../console-body';

export const section: ISection = { 
  name: 'sections', 
  title: 'Sections',
  description: 'All available sections', 
  icon: <BookmarkIcon/>, 
  class: 'ml-2 text-sm',
  component: <ConfigSections/>,
  isInfoSection: false
}

export default function ConfigSections() {

  const configuration = useAppStore((state) => state.site);
  const enableSection = useAppStore((state) => state.enableSection);

  const onSectionClick = (section: ISection) => {
    enableSection(
      !(!!configuration?.sections[section.name.toLowerCase() as keyof ISiteSections]),
      section.name.toLowerCase()
    );
  }

  return (
    <ConsoleBody full={true}
      saveOff={true}
      title={section.title} subTitle={section.description}
      invalid={false} saving={false} 
      onCancel={() => null}
      onSave={() => null}>

      <div className="flex flex-col gap-8 select-none">
        
        {configuration?.sections && 
          <div role="list" className="gap-6 grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => {
              if (section.isInfoSection) {
                return (
                  <div key={section.name} className="divide-y divide-gray-200 rounded-lg bg-white shadow flex flex-col">
                    <div className="grow flex w-full items-center justify-between space-x-6 p-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-md truncate font-medium text-gray-900 uppercase">{section.name}</h3>
                        </div>
                        <p className="mt-1 t ext-sm text-gray-500">{section.description}</p>
                      </div>
                      <div className="h-10 w-10 flex-shrink-0 rounded-full text-blue-400">
                        {section.icon}
                      </div>
                    </div>
                    <div className="grow-0">
                      <div className="-mt-px flex divide-x divide-gray-200">
                        <div className="flex w-0 flex-1 px-2 py-4 items-center justify-center cursor-pointer hover:bg-gray-100"
                          onClick={() => onSectionClick(section)} title="Click to enable or disable">
                          {!!configuration?.sections[section.name.toLowerCase() as keyof ISiteSections]?.enabled && 'Enabled'}
                          {!(!!configuration?.sections[section.name.toLowerCase() as keyof ISiteSections]?.enabled) && 'Disabled'}
                        </div>
                        <Link className="flex w-0 flex-1 px-2 py-4 items-center justify-center cursor-pointer hover:bg-gray-100"
                          href={`/console/site/${configuration._id}/${section.name}`}>
                          Configure
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              } else {
                return null;
              }
            })}
          </div>
        }
      </div>
    </ConsoleBody>
  )
}