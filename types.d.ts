import type { NextComponentType, NextPageContext, NextLayoutComponentType } from 'next';
import type { AppProps } from 'next/app';

declare module 'next' {
  type NextLayoutComponentType<P = {}> = NextComponentType<NextPageContext, any, P> & {
    getLayout?: (page: ReactNode) => ReactNode;
  };
}

declare module 'next/app' {
  type AppLayoutProps<P = {}> = AppProps & {
    Component: NextLayoutComponentType;
  };
}

declare module 'formidable';
declare module 'mime';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      sumobubble: CustomElement<>;
    }
  }
}

declare global {
  interface Window {
    onInfoChatPreviewUpdate: any;
  }
}
