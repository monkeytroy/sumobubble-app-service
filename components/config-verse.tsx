import VerseTranslationSelect from "./verse-translation-select";

export default function ConfigVerse() {

  return (
    <div className="flex flex-col gap-4">

      <div className="flex gap-4 items-baseline py-4">
        <span className="text-xl font-semibold text-gray-900">Daily Verse</span>
        <span className="text-sm text-gray-600">
          An automatic or personal verse of the day in the translation of your choice.
        </span>
      </div>

      <div className="col-span-full flex gap-x-3">
        <div className="flex h-6 items-center">
          <input id="verseEnabled" name="verseEnabled" type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          />
        </div>
        <div className="text-sm leading-6">
          <label htmlFor="verseEnabled" className="font-medium text-gray-900">
            Enable
          </label>
          <p className="text-gray-500">Enable / Disable this section.</p>
        </div>
      </div>

      <div className="sm:col-span-4">
        <VerseTranslationSelect></VerseTranslationSelect>
      </div>

      <div className="col-span-full flex gap-x-3">
        <div className="flex h-6 items-center">
          <input id="verseAuto" name="verseAuto" type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          />
        </div>
        <div className="text-sm leading-6">
          <label htmlFor="verseAuto" className="font-medium text-gray-900">
            Auto Verse
          </label>
          <p className="text-gray-500">Let Beacon provide a daily verse.</p>
        </div>
      </div>

      <div className="sm:col-span-3">
        <label htmlFor="verseRef" className="block text-sm font-medium leading-6 text-gray-900">
          Verse Reference (Psalms 1:1-4)
        </label>
        <div className="mt-2">
          <input
            type="text" name="verseRef" id="verseRef"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm 
              ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="col-span-full">
        <label htmlFor="verseBody" className="block text-sm font-medium leading-6 text-gray-900">
          Verse Body
        </label>
        <div className="mt-2">
          <textarea
            id="verseBody" name="verseBody" rows={4}
            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 
              ring-inset ring-gray-300 placeholder:text-gray-400 
              focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
            defaultValue={''}
          />
        </div>
      </div>

    </div>
  )
}