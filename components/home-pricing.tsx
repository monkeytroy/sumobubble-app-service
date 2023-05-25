import { IAppProps } from "@/services/ssp-default";
import { signIn, useSession } from "next-auth/react";

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

export default function HomePricing(props: IAppProps) {
  const {data: session} = useSession();

  return (
    <div className="py-24 sm:py-32 select-none bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
            Pricing plans made easy
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">
          Choose an affordable plan that's perfect for your organization and customers.
        </p>

        <div className="isolate mx-auto mt-10 relative">

          {!session && 
            <div className="absolute inset-0 opacity-0 bg-gray-800 cursor-pointer"
              onClick={() => signIn('auth0', { callbackUrl: '/#pricing' })}>
            </div>
          }
          
          {props.stripe?.key && props.stripe?.homeId && 
            <stripe-pricing-table 
              customer-email={session?.user?.email}
              success-url="http://localhost:3000/"
              pricing-table-id={props.stripe?.homeId}
              publishable-key={props.stripe?.key}>
            </stripe-pricing-table>
          }
          
        </div>
      </div>
    </div>
  )
}
