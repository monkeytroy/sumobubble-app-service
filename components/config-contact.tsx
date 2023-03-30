
export default function ConfigSpecial() {
  
  return (
    <div className="flex flex-col gap-4">

      <div className="flex gap-4 items-baseline py-4">
        <span className="text-xl font-semibold text-gray-900">Contact</span>
        <span className="text-sm text-gray-600">
          Configure the Contact Panel
        </span>
      </div>

      <div className="col-span-full flex gap-x-3">
        <div className="flex h-6 items-center">
          <input id="contactEnabled" name="contactEnabled" type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          />
        </div>
        <div className="text-sm leading-6">
          <label htmlFor="comments" className="font-medium text-gray-900">
            Enable
          </label>
          <p className="text-gray-500">Enable / Disable this section.</p>
        </div>
      </div>
      
      <div className="col-span-full">
        <label htmlFor="contact" className="block text-sm font-medium leading-6 text-gray-900">
          Contact Invite
        </label>
        <div className="mt-2">
          <textarea
            id="contact" name="contact" rows={4}
            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 
              ring-inset ring-gray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
            defaultValue={''}
          />
        </div>
        <p className="mt-3 text-sm leading-6 text-gray-600 flex gap-6">
          Invite your guest to contact you.
        </p>
      </div>

      <div className="sm:col-span-4">
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Target email address
        </label>
        <div className="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
        
    </div>
  )
}