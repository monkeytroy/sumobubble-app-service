
export type Translation = 'ESV' | 'ASV' | 'KJV';

export interface ITranslation {
  title: string,
  copyright: string
}

export type Translations = {
  [key in Translation]: ITranslation
}

export const translations: Translations = {
  "ESV": {
    title: "English Standard Version",
    copyright: "Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers."
  },
  "ASV": {
    title: "American Standard Version",
    copyright: "Scripture quotations are from the ASV® Bible." 
  },
  "KJV": {
    title: "King James Version",
    copyright: "The king doeth proclaim this version be legit."
  }
}