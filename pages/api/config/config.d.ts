declare module "copyright.json" {
}

interface Copyrights {
  [name: string]: string;
}

type ConfigRes = {
  success: boolean,
  message: string,
  data: CustomerConfigResult
}

interface CustomerConfig {
  _id?: string;
  customerId: string;
  customerPin: string;
  customer: {
    title: string;
    theme: {
      primary: string;
    },
    logo: {
      url: string;
      align: string;
    },
    social: {
      youtube: string;
    }
  },
  summary: {
    content: string;
  },
  special: {
    content: string;
  },
  contact: {
    enabled: boolean;
    content: string;
    contact: string;
  },
  funny: {
    enabled: boolean;
    lines: Array<string>;
    meme: string;
  },
  verse: {
    enabled: boolean;
    verseRef?: string;
    translation?: string;
    content?: string;
    copyright?: string;
  },
  vod: {
    enabled: boolean;
    content?: string;
    url?: string;
  }
}

type CustomerConfigResult = Omit<CustomerConfig, "customerPin">;