import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, FormEvent } from "react";

export default function LoginForm() {

  const router = useRouter();

  const [customerId, setCustomerId] = useState('');
  const [customerPin, setCustomerPin] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const handleLogin = async (event: FormEvent) => {

    event.preventDefault();
    event.stopPropagation();
  
    const result = await signIn("credentials", {
        customerId, customerPin, 
        callbackUrl: `${window.location.origin}`, redirect: false 
    });

    // check login.  reroute. 
    if (result?.error) {
      if (result?.status === 401) {
        setLoginError("Your login was incorrect. Please try again");
      } else {
        setLoginError(result?.error || 'Oops.');
      }
    } else {
      router.push(result?.url || '');
    }
  }

  return (
    <form onSubmit={(e) => handleLogin(e)}>
      <div className="mt-6 flex justify-center items-center">

        <div className="p-8 bg-gray-50 border-2 border-gray-200 rounded-md flex flex-col w-72 gap-2">

          <label>Customer ID:</label>
          <input type='text' className="rounded-md" value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
          
          <label>PIN:</label>
          <input type='password' className="rounded-md" value={customerPin} onChange={(e) => setCustomerPin(e.target.value)} />         
          
          <button type='submit'
            className="mt-4 rounded-md bg-blue-500 py-3 px-3 text-sm font-semibold 
            text-white shadow-sm hover:bg-blue-600 disabled:opacity-25
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Login</button>

          {loginError && 
            <div className="bg-red-300 p-4 my-4">
              {loginError}
            </div>
          }

        </div>
      </div>

    </form>
  )
}