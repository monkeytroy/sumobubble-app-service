declare module "copyright.json" {
}

enum Sections {
  contact = 'contact'
}

interface IBeaconSections {
  contact?: IBeaconSection,
  verse?: IBeaconSection,
  spotlight?: IBeaconSection,
  funny?: IBeaconSection
}

interface IBeaconSection {
  title?: string;
  enabled: boolean;
  content: string;
  urls?: string[];
  props: {
    verseRef?: string;
    autoFill?: boolean;
    translation?: string;
    email?: string;
    copyright?: string;
  }
}

interface IBeaconConfig {
  customerId: string;
  pin?: string;
  isDev?: boolean;
  customer: {
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
  }
  summary: {
    content: string;
    special?: string;
  }
  sections: IBeaconSections
}

interface Copyrights {
  [name: string]: string;
}

type ConfigRes = {
  success: boolean,
  message: string,
  data: IBeaconConfig
}
