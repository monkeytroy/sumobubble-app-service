import {
  BookmarkIcon,
  HomeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

import { ISection, sections } from '@/components/sections/sections';
import { useRouter } from 'next/router';

// configuration so 'current' works.
const navigation: Array<ISection> = [
  { 
    name: 'summary', 
    title: 'Summary',
    description: 'Summary info displayed when app is opened', 
    href: '/', 
    icon: <HomeIcon/>, 
    class: 'text-sm' 
  },
  { 
    name: 'sections', 
    title: 'Sections',
    description: 'All available sections', 
    href: '/sections', 
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
  const { section } = router.query;
  const currentRoute = router.route;

  const current = (item: ISection) => {
    return currentRoute == item.href || section == item.name.toLowerCase()
  }

  return (
    <div className="flex shrink-0 flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6">
      <div className="flex h-16 shrink-0 items-center">
        <InformationCircleIcon className="text-gray-50 h-10 w-auto"></InformationCircleIcon>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a href={item.href}
                    className={classNames(
                      item.class,
                      current(item)
                        ? 'bg-indigo-700 text-white'
                        : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
                      'group flex gap-x-3 rounded-md p-2 leading-6 font-semibold'
                    )}
                  >
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
          </li>

          <li className="-mx-6 mt-auto">
          </li>
        </ul>
      </nav>
    </div>
  )
}