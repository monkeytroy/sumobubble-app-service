declare module "copyright.json" {
}

interface Copyrights {
  [name: string]: string;
}

type ConfigRes = {
  success: boolean,
  message: string,
  data: any
}

type CustomerConfig = {
  customerId: string,
  customer: {
    title: string,
    theme: {
      primary: string,
    },
    logo: {
      url: string,
      align: string
    },
    social: {
      youtube: string
    }
  },
  summary: {
    content: string
  },
  special: {
    content: string
  },
  contact: {
    enabled: boolean,
    content: string,
    contact: string
  },
  funny: {
    enabled: boolean,
    lines: Array<string>,
    meme: string
  },
  verse: {
    enabled: boolean,
    verseRef?: string,
    translation?: string,
    content?: string,
    copyright?: string
  },
  vod: {
    enabled: boolean,
    content?: string,
    url?: string
  }
}