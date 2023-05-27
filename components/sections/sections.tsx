import { ReactElement } from "react";

import { section as sectionSetup } from './config-setup';
import { section as sectionChatbot } from './config-chatbot';
import { section as sectionSummary } from './config-summary';
import { section as sectionSections } from './config-sections';
import { section as sectionContact } from '@/components/sections/config-contact';
import { section as sectionInfoRequest } from '@/components/sections/config-info-request';
import { section as sectionSpotlight } from '@/components/sections/config-spotlight';
//import { section as sectionFunny } from '@/components/sections/config-funny';
//import { section as sectionVerse } from '@/components/sections/config-verse';

export interface ISection {
  name: string,
  title: string,
  description: string,
  icon: ReactElement,
  class: string,
  component?: ReactElement,
  isInfoSection?: boolean
}

export const sections: Array<ISection> = [
  { ...sectionSetup },
  { ...sectionChatbot },
  { ...sectionSummary },
  { ...sectionSections },
  { ...sectionContact},
  { ...sectionInfoRequest },
  { ...sectionSpotlight },
  //{ ...sectionVerse },
  //{ ...sectionFunny }
];