import {
  BookmarkIcon,
  HomeIcon,
  DocumentTextIcon,
  ArrowUpOnSquareIcon,
} from '@heroicons/react/24/outline'

import { ISection, sections } from '@/components/sections/sections';
import { useRouter } from 'next/router';
import { IAppState, useAppStore } from '@/store/app-store';

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

  const current = (item: ISection) => {
    return currentRoute.endsWith(`/${item.route}`) || section == item.name.toLowerCase()
  }

  return (
    <div className="w-64 overflow-hidden flex min-h-screen shrink-0 flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pt-20">
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
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
                Sites
              </a>
            </ul>
            
            <ul>
              <div className="text-white group rounded-md p-2 leading-6 font-semibold truncate">
                {configuration?.title}
              </div>
            </ul>

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

          <li className="-mx-6 mt-auto">
          </li>
        </ul>
      </nav>
    </div>
  )
}