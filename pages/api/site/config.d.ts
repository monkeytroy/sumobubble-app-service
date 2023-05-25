
// enum Sections {
//   contact = 'contact'
// }

interface IBeaconSite {
  _id?: string;
  customerId: string;
  customerEmail: string;
  title: string;
  theme?: {
    primary?: string;
  }
  logo?: {
    url?: string;
    align?: string;
  },
  social?: {
    youtube?: string;
  }
  summary: {
    content: string;
    special?: string;
  }
  sections: IBeaconSections
}

interface IBeaconSections {
  [name: string]: IBeaconSection
}

interface IBeaconSection {
  title?: string;
  enabled: boolean;
  content: string;
  urls?: string[];
  props?: {
    chatsite?: string;                // the url for the site the chat will be baesd off
    chatbaseId?: string;              // the chatbase bot id
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
  data: IBeaconConfig
}

interface IContactCategory {
  title: string,
  email: string
}