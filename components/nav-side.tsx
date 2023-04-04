import {
  BookmarkIcon,
  BookOpenIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  InformationCircleIcon,
  TvIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Summary', href: '/', icon: HomeIcon, current: true},
  { name: 'Sections', href: '/sections', icon: BookmarkIcon, current: false },
  { name: 'Contact', href: '/sections/contact', icon: UsersIcon, current: false, sub: true },
  { name: 'Verse', href: '/sections/verse', icon: BookOpenIcon, current: false, sub: true },
  { name: 'Spotlight', href: '/sections/spotlight', icon: TvIcon, current: false, sub: true },
  { name: 'Funny', href: '/sections/funny', icon: DocumentDuplicateIcon, current: false, sub: true }
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function NavSide() {
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
                  <a
                    href={item.href}
                    className={classNames(
                      item.sub ? 'ml-2 text-xs' : 'text-sm',
                      item.current
                        ? 'bg-indigo-700 text-white'
                        : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
                      'group flex gap-x-3 rounded-md p-2 leading-6 font-semibold'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                        'h-6 w-6 shrink-0'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  
                    {/* {item.count ? (
                      <span
                        className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-indigo-600 px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-white ring-1 ring-inset ring-indigo-500"
                        aria-hidden="true"
                      >
                        {item.count}
                      </span>
                    ) : null} */}
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