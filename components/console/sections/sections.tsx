import { ReactElement } from 'react';

import { section as sectionSetup } from './config-setup';
import { section as sectionChat } from './config-chat';
import { section as sectionSummary } from './config-summary';
import { section as sectionSections } from './config-sections';
import { section as sectionContact } from './config-contact';
import { section as sectionInfoRequest } from './config-info-request';
import { section as sectionSpotlight } from './config-spotlight';
//import { section as sectionFunny } from '@/components/sections/config-funny';

export interface ISection {
  name: string;
  title: string;
  description: string;
  icon: ReactElement;
  class: string;
  component?: ReactElement;
  isInfoSection?: boolean;
}

// These sections are what are loaded for the side bar and available to users.
export const sections: Array<ISection> = [
  { ...sectionSetup },
  { ...sectionChat },
  { ...sectionSummary },
  //{ ...sectionSections },
  { ...sectionContact },
  { ...sectionInfoRequest },
  { ...sectionSpotlight }
  //{ ...sectionFunny }
];
