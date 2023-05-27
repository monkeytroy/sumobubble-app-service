
export default function ConfigSubmit({ saving, invalid }: { saving: boolean, invalid?: boolean}) {

  return (
    <div className="flex items-center justify-start gap-x-6">
      <button type="reset" disabled={saving || invalid}
        className="text-sm font-semibold leading-6 text-gray-900 disabled:opacity-25">
        Cancel
      </button>
      <button type="submit" disabled={saving || invalid}
        className="rounded-md bg-blue-500 py-2 px-3 text-sm font-semibold 
          text-white shadow-sm hover:bg-blue-600 disabled:opacity-25
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Save
      </button>
      {invalid && 
        <div className="text-red-600 text-sm">Something is not quite right...</div>
      }
    </div>
  )
}