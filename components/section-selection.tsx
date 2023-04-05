import { useAppStore, IAppState } from '@/store/app-store';
import { AtSymbolIcon, BookOpenIcon,  
    FaceSmileIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import router from 'next/router';
import { useMemo } from 'react';

interface ISectionRender {
  name: string,
  title: string,
  enabled: boolean,
  url?: string,
  icon: any
}

export default function SectionSelection() {

  const configuration = useAppStore((state: IAppState) => state.configuration);
  const enableSection = useAppStore((state: IAppState) => state.enableSection);

  const sections = useMemo((): Array<ISectionRender> => {
    return [
      {
        name: 'Contact',
        title: 'Contact form with customizable intro.',
        enabled: configuration?.sections?.contact?.enabled || false,
        url: '/sections/contact',
        icon: <AtSymbolIcon className="color-gray-600"></AtSymbolIcon>
      },
      {
        name: 'Verse',
        title: 'A custom static or automatic daily verse in the translation of your choice.',
        enabled: configuration?.sections?.verse?.enabled || false,
        url: '/sections/verse',
        icon: <BookOpenIcon></BookOpenIcon>
      },
      {
        name: 'Spotlight',
        title: 'A video or channel to spotlight for your guests.',
        enabled: configuration?.sections?.spotlight?.enabled || false,
        url: '/sections/spotlight',
        icon: <VideoCameraIcon></VideoCameraIcon>
      },
      {
        name: 'Funny',
        title: 'A custom or automatic daily funny item!',
        enabled: configuration?.sections?.funny?.enabled || false,
        url: '/sections/funny',
        icon: <FaceSmileIcon></FaceSmileIcon>
      }
    ];
  }, [configuration]);

  const onSectionClick = (section: ISectionRender) => {
    enableSection(!section.enabled, section.name.toLowerCase());
  }

  return (
    <div className="flex flex-col gap-8 select-none">

      <div className="flex gap-4 items-baseline py-4">
        <span className="text-xl font-semibold text-gray-900">Sections</span>
        <span className="text-sm text-gray-600">
          All these sections are available to your Info Beacon!
        </span>
      </div>
      
      <div role="list" className="gap-6 grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <div key={section.name} className="divide-y divide-gray-200 rounded-lg bg-white shadow flex flex-col">
            <div className="grow flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-sm truncate font-medium text-gray-900">{section.name}</h3>
                </div>
                <p className="mt-1 t ext-sm text-gray-500">{section.title}</p>
              </div>
              <div className="h-10 w-10 flex-shrink-0 rounded-full text-blue-400">
                {section.icon}
              </div>
            </div>
            <div className="grow-0">
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="flex w-0 flex-1 px-2 py-4 items-center justify-center cursor-pointer hover:bg-gray-100"
                  onClick={(e) => onSectionClick(section)} title="Click to enable or disable">
                  {section.enabled && 'Enabled'}
                  {!section.enabled && 'Disabled'}
                </div>
                <div className="flex w-0 flex-1 px-2 py-4 items-center justify-center cursor-pointer hover:bg-gray-100"
                  onClick={() => section.url ? router.push(section.url) : null}>
                  Configure
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}