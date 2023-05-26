import {
  BookmarkIcon,
  HomeIcon,
  DocumentTextIcon,
  ArrowUpOnSquareIcon,
  ServerIcon,
} from '@heroicons/react/24/outline'

import { ISection, sections } from '@/components/sections/sections';
import { useRouter } from 'next/router';
import { IAppState, useAppStore } from '@/store/app-store';
import { useState } from 'react';
import { publishSite } from '@/services/site';
import { toast } from 'react-toastify';

// configuration so 'current' works.
const navigation: Array<ISection> = [
  { 
    name: 'summary', 
    title: 'Summary',
    description: 'Summary info displayed when app is opened', 
    route: 'summary', 
    icon: <DocumentTextIcon></DocumentTextIcon>,
    class: 'text-sm' 
  },
  {
     
    name: 'deploy', 
    title: 'Deploy',
    description: 'Deploy your InfoChat App', 
    route: 'deploy', 
    icon: <ArrowUpOnSquareIcon></ArrowUpOnSquareIcon>,
    class: 'text-sm' 
  },
  { 
    name: 'sections', 
    title: 'Sections',
    description: 'All available sections', 
    route: 'sections', 
    icon: <BookmarkIcon/>, 
    class: 'text-sm' 
  },
  ...sections
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function NavSide() {

  const router = useRouter();
  const { section, siteId } = router.query;
  const currentRoute = router.route;
  
  const configuration = useAppStore((state: IAppState) => state.configuration);
  const [saving, setSaving] = useState(false);

  const current = (item: ISection) => {
    return currentRoute.endsWith(`/${item.route}`) || section == item.name.toLowerCase()
  }

  const onPublish = async () => {
    if (configuration?._id) {
      setSaving(true);

      try {
        await publishSite(configuration._id);       
      } finally {
        setTimeout(() => setSaving(false), 2000);
      }
      
    } else {
      toast.warn('No site loaded... cannot publish.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  }

  return (
    <div className="w-64 overflow-hidden flex min-h-screen shrink-0 
      flex-col overflow-y-auto bg-indigo-600 px-4 pt-20">
      <nav className="">
        <ul role="list" className="flex flex-col gap-4">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              <a href={`/console`}
                className={classNames(currentRoute == '/console' ? 'bg-indigo-700 text-white'
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
                  'group flex gap-x-3 rounded-md p-2 leading-6 font-semibold'
                )}>
                <span className={classNames(
                    currentRoute == '/console' ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                    'h-6 w-6 shrink-0'
                  )}
                  aria-hidden="true">
                  <HomeIcon></HomeIcon>
                </span>
                Account
              </a>
            </ul>
          </li>
          <li>
            <div className="border-t border-gray-400 py-2 text-xs font-semibold leading-6 text-indigo-200">
              Site Name
            </div>
            <div className="text-white group rounded-md leading-6 font-semibold truncate">
              {configuration?.title || 'Create or Select'}
            </div>
            <button type="button" disabled={!configuration || saving}
              onClick={() => onPublish()}
              title="Site changes only available to user after a publish!"
              className="w-full my-4 rounded-md bg-blue-500 py-2 px-3 text-sm font-semibold 
                text-white shadow-sm hover:bg-blue-600 disabled:opacity-25
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Publish Site Now
            </button>
          </li>
          <li>

            <div className="border-t border-gray-400 py-2 text-xs font-semibold leading-6 text-indigo-200">
              Site Settings
            </div>

            <div className={configuration ? '' : 'pointer-events-none select-none opacity-50'}>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <a href={`/console/site/${siteId}/${item.route}`}
                      className={classNames(
                        item.class,
                        current(item)
                          ? 'bg-indigo-700 text-white'
                          : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
                        'group flex gap-x-3 rounded-md p-2 leading-6 font-semibold'
                      )}>
                      <span className={classNames(
                          current(item) ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                          'h-6 w-6 shrink-0'
                        )}
                        aria-hidden="true"
                      >{item.icon}
                      </span>
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          <li className="mt-auto">
          </li>
        </ul>
      </nav>
    </div>
  )
}