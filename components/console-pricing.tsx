import { signIn, useSession } from "next-auth/react";
import { Dialog, Transition } from '@headlessui/react'
import { useState, Fragment } from "react";
import { IAppProps } from "@/services/ssp-default";
import { useAppStore } from "@/store/app-store";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export default function ConsolePricing(props: IAppProps) {

  const customer = useAppStore((state: any) => state.customer);

  const {data: session} = useSession();
  let [isOpen, setIsOpen] = useState(true);

  const closeModal = () => {
    setIsOpen(false);
  }

  const openModal = () => {
    setIsOpen(true);
  }

  return (

    <div className="z-50">

      {!isOpen && 
        <button
          type="button" onClick={openModal}
          className="z-50 absolute top-0 right-0 justify-center rounded-md border 
            border-transparent bg-gray-300 px-4 py-2 text-sm 
            font-medium text-gray-700 hover:bg-blue-200 
            focus:outline-none focus-visible:ring-2 
            focus-visible:ring-blue-500 focus-visible:ring-offset-2">
          Subscribe!
        </button>
      }

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center bg-gray-200 bg-opacity-30">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">

                <Dialog.Panel 
                  className="w-11/12 xl:w-3/5 transform overflow-hidden rounded-2xl 
                  bg-white p-6 text-left align-middle shadow-xl transition-all">

                  <div className="py-2 select-none bg-white">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                      <div className="mx-auto max-w-4xl text-center">
                        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-700 sm:text-5xl">
                          Subscribe!
                        </p>
                      </div>
                      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-500">
                        Choose an affordable plan that meets your needs to deploy your app!
                      </p>

                      <div className="isolate mx-auto mt-10 relative">

                      {props?.stripe?.key && props?.stripe?.consoleId && 
                        <stripe-pricing-table 
                          customer-email={session?.user?.email}
                          success-url={process.env.NEXTAUTH_URL}
                          pricing-table-id={props?.stripe?.consoleId}
                          publishable-key={props?.stripe?.key}>
                        </stripe-pricing-table>
                      }

                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center">
                    <button
                      type="button" onClick={closeModal}
                      className="inline-flex justify-center rounded-md border 
                        border-transparent bg-gray-300 px-4 py-2 text-sm 
                        font-medium text-gray-700 hover:bg-blue-200 
                        focus:outline-none focus-visible:ring-2 
                        focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                      Maybe Later
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}
