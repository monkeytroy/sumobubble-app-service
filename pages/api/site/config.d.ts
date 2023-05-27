
// enum Sections {
//   contact = 'contact'
// }

interface ISite {
  _id?: string;
  customerId: string;
  customerEmail: string;
  title: string;
  theme?: {
    primary?: string;
  }
  social?: {
    youtube?: string;
  }
  summary: {
    enabled: boolean;
    content: string;
    special?: string;
  },
  chatbot: {
    enabled: boolean;
    chatsite?: string;                // the url for the site the chat will be baesd off
    chatbaseId?: string;              // the chatbase bot id
  }
  sections: ISiteSections
}

interface ISiteSections {
  [name: string]: ISiteSection
}

interface ISiteSection {
  title?: string;
  enabled: boolean;
  content: string;
  urls?: string[];
  props?: {
    verseRef?: string;
    autoFill?: boolean;
    translation?: string;
    email?: string[];
    copyright?: string;
    categories?: IContactCategory[];
  }
}

interface Copyrights {
  [name: string]: string;
}

type ConfigRes = {
  success: boolean,
  message: string,
  data: ISite
}

interface IContactCategory {
  title: string,
  email: string
}