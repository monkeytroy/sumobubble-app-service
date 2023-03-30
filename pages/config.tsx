import { useSession } from 'next-auth/react'

export default function Home() {

  const { data: session, status } = useSession();

  return (
    <>
      <div className="bg-white py-24 px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-8">
            Beacon
          </h2>
          {session &&
            <>
              <p style={{ marginBottom: '10px' }}> Welcome, {session?.user?.name}</p> <br />
            </>
          }
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Edit soon.
          </p>
        </div>
      </div>
    </>
  )
}
