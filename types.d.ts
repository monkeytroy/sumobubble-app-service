import type { NextComponentType, NextPageContext, NextLayoutComponentType } from 'next';
import type { AppProps } from 'next/app';
import { DefaultSession, DefaultUser } from 'next-auth';

declare global {
  interface Window {
    onPreviewUpdate: any;
  }
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
    interface IntrinsicElements {
      'sumobubble-wc': CustomElement<>;
    }
  }
}

declare module 'next-auth' {
  interface Session {
    user: DefaultUser;
  }
}
