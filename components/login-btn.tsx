import { useSession, signOut } from "next-auth/react"
import Link from "next/link";

const LoginBtn = () => {

  const { data: session } = useSession();

  return (
    <>
      {session &&
        <div className="p-4">
          <span className="mr-4">Welcome, {session?.user?.name}</span>
          <button type="button" 
          className="rounded-md bg-blue-500 py-2 px-3 text-sm font-semibold 
          text-white shadow-sm hover:bg-blue-600 disabled:opacity-25
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" 
          onClick={()=>signOut()}>Logout</button>
        </div>
      }
      {!session &&
        <Link href="login" className="rounded-md bg-blue-100 px-4 py-2 hover:bg-blue-200">Sign In</Link>
      }
    </>
  )
}

export default LoginBtn;