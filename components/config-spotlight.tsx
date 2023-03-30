
export default function ConfigSpotlight() {

  return (
    <div className="flex flex-col gap-4">

      <div className="flex gap-4 items-baseline py-4">
        <span className="text-xl font-semibold text-gray-900">Spotlight</span>
        <span className="text-sm text-gray-600">
          A video to highlight to your guests.
        </span>
      </div>

      <div className="col-span-full flex gap-x-3">
        <div className="flex h-6 items-center">
          <input id="spotlightEnabled" name="spotlightEnabled" type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          />
        </div>
        <div className="text-sm leading-6">
          <label htmlFor="spotlightEnabled" className="font-medium text-gray-900">
            Enable
          </label>
          <p className="text-gray-500">Enable / Disable this section.</p>
        </div>
      </div>

      <div className="col-span-full">
        <label htmlFor="spotlightContent" className="block text-sm font-medium leading-6 text-gray-900">
          Spotlight Introduction
        </label>
        <div className="mt-2">
          <textarea
            id="spotlightContent" name="spotlightContent" rows={4}
            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 
              ring-inset ring-gray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
            defaultValue={''}
          />
        </div>
        <p className="mt-3 text-sm leading-6 text-gray-600 flex gap-6">
          Introduce the spotlight video.
        </p>
      </div>

      <div className="sm:col-span-4">
        <label htmlFor="spotlightUrl" className="block text-sm font-medium leading-6 text-gray-900">
          Video URL (Use embed url)
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 
            focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">https://</span>
            <input type="text" name="spotlightUrl" id="spotlightUrl"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900
                placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="https://www.youtube.com/embed/qVEOJzAYIW4"
            />
          </div>
        </div>
      </div>

    </div>
  )
}