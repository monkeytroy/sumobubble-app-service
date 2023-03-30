import { useSession, signOut } from "next-auth/react"
import Link from "next/link";

const LoginBtn = () => {

  const { data: session } = useSession();

  return (
    <>
      {session &&
        <div className="p-4">
          <span className="mr-4">Welcome, {session?.user?.name}</span>
          <button type="button" className="rounded-md bg-blue-200 px-2 py-1" onClick={()=>signOut()}>Logout</button>
        </div>
      }
      {!session &&
        <Link href="login">Please sign in</Link>
      }
    </>
  )
}

export default LoginBtn;