import type { NextComponentType, NextPageContext, NextLayoutComponentType } from 'next';
import type { AppProps } from 'next/app';

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
