// enum Sections {
//   contact = 'contact'
// }

interface ISite {
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

interface ISiteSections {
  [name: string]: ISiteSection;
}

interface IChatSite {
  url: string;
  active: boolean;
  progress: number;
  message: string;
}

interface Copyrights {
  [name: string]: string;
}

type ConfigRes = {
  success: boolean;
  message: string;
  data: ISite;
};
