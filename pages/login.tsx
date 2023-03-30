import * as React from "react";
import {FormEvent, useState} from "react";
import { signIn } from 'next-auth/react'
import { useRouter } from "next/router";

export default function Home() {

  const router = useRouter();

  const [customerId, setCustomerId] = useState('');
  const [customerPin, setCustomerPin] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const handleLogin = async (event: FormEvent) => {

    event.preventDefault();
    event.stopPropagation();
  
    console.log('login');
    const result = await signIn("credentials", {
        customerId, customerPin, 
        callbackUrl: `${window.location.origin}`, redirect: false 
    });
    console.log('login result');
    if (result?.error !== null) {
      if (result?.status === 401) {
        setLoginError("Your login was incorrect. Please try again");
      } else {
        setLoginError(result?.error || 'Oops.');
      }
    } else {
      router.push(result.url || '');
    }
  }

  return (
    <form onSubmit={(e) => handleLogin(e)}>
      <div className="mt-6 flex justify-center items-center">

        <div className="p-4 bg-gray-200 border-2 border-gray-400 flex flex-col w-72 gap-2">
          <div className="text-2xl font-bold">Beacon</div>
          <label>Customer ID:</label>
          <input type='text' value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
          
          <label>PIN:</label>
          <input type='password' value={customerPin} onChange={(e) => setCustomerPin(e.target.value)} />         
          
          <button className="mt-2 p-4 bg-blue-300" type='submit'>Submit login</button>

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


