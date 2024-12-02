// enum Sections {
//   contact = 'contact'
// }

import { ISiteSection } from '@/models/site';

export interface ISite {
  _id?: string;
  customerId: string;
  customerEmail: string;
  title: string;
  button?: string;
  theme?: {
    primary?: string;
  };
  social?: {
    youtube?: string;
  };
  summary: {
    enabled: boolean;
    content: string;
    special?: string;
  };
  chatbot: {
    enabled: boolean;
    sites?: IChatSite[];
    chatbotId?: string;
  };
  sections: ISiteSections;
}

export interface ISiteSections {
  [name: string]: ISiteSection;
}

export interface IChatSite {
  url: string;
  active: boolean;
  progress: number;
  message: string;
}

export interface Copyrights {
  [name: string]: string;
}

export type ConfigRes = {
  success: boolean;
  message: string;
  data?: ISite;
};
