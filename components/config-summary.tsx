import { PhotoIcon } from "@heroicons/react/24/solid";
import { FormEvent, useState } from "react";

export default function ConfigSummary() {

  const [special, setSpecial] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    await fetch('http://localhost:3000/api/config/fred2', {
      method: 'POST',
      headers: {
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCRUFDT04iLCJuYW1lIjoiR2xvYmFsIiwiaWF0IjoxNTE2MTM5MDIyfQ.eVrEhwKxF4Dfj2S5fFFMnwLAae-E1h3Ilo9PQKgPYic'
      },
      body: JSON.stringify({
        specialContent: special
      }) 
    });

  }

  return (
    <form onSubmit={submit} >
      <div className="flex flex-col gap-4 pb-8 border-b border-gray-900/10">

        <div className="flex gap-4 items-baseline py-4">
          <span className="text-xl font-semibold text-gray-900">Customer Info</span>
          <span className="text-sm text-gray-600">
            All about your organization!
          </span>
        </div>
          
        <div className="sm:col-span-3">
          <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
            Title - Text in the Beacon header
          </label>
          <div className="mt-2">
            <input
              type="text" name="title" id="title"
              className="block w-full max-w-lg rounded-md border-0 py-1.5 text-gray-900 shadow-sm 
                ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="logo" className="block text-sm font-medium leading-6 text-gray-900">
            Logo - Logo at the top of the Summary
          </label>
          <div className="mt-2 flex items-center gap-x-3">
            <PhotoIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
            <button
              type="button"
              className="rounded-md bg-white py-1.5 px-2.5 text-sm font-semibold text-gray-900 
                shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              Change
            </button>
          </div>
        </div>
        

        <div className="col-span-full">
          <label htmlFor="summary" className="block text-sm font-medium leading-6 text-gray-900">
            Summary - Summary text always displayed first! (Supports some markdown syntax)
          </label>
          <div className="mt-2">
            <textarea
              id="summary" name="summary" rows={4}
              className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 
                ring-inset ring-gray-300 placeholder:text-gray-400 
                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
              defaultValue={''}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-600 flex gap-6">
            <span>**Bold**</span>
            <span>[Link Text](https://full-url.com)</span>
            <span>\n\n = New Line</span>
          </p>
        </div>

        <div className="col-span-full">
          <label htmlFor="summary" className="block text-sm font-medium leading-6 text-gray-900">
            Special - A highlighted special announcement (Supports some markdown syntax)
          </label>
          <div className="mt-2">
            <textarea
              id="special" name="special" rows={3}
              value={special}
              onChange={e => setSpecial(e.target.value)}
              className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 
                ring-inset ring-gray-300 placeholder:text-gray-400 
                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
              defaultValue={''}
            />
          </div>
        </div>

      </div>
    
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>
        <button type="submit"
          className="rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold 
            text-white shadow-sm hover:bg-indigo-500 
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Save
        </button>
      </div>

    </form>
  )
}