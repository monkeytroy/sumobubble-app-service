import { ReactElement } from "react";

//import { section as sectionTest } from '@/components/sections/config-test';
import { section as sectionContact } from '@/components/sections/config-contact';
import { section as sectionInfoRequest } from '@/components/sections/config-info-request';
//import { section as sectionVerse } from '@/components/sections/config-verse';
import { section as sectionSpotlight } from '@/components/sections/config-spotlight';
//import { section as sectionFunny } from '@/components/sections/config-funny';
import { section as sectionChatbot } from '@/components/sections/config-chatbot';

export interface ISection {
  name: string,
  title: string,
  description: string,
  route: string,
  icon: ReactElement,
  class: string,
  component?: ReactElement
}

export const sections: Array<ISection> = [
  { ...sectionChatbot },
  { ...sectionContact},
  { ...sectionInfoRequest },
  //{ ...sectionVerse },
  { ...sectionSpotlight },
  //{ ...sectionFunny }
];