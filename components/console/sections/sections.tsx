import { ReactElement } from 'react';

import { section as sectionSetup } from './config-setup';
import { section as sectionAsk } from './config-ask';
import { section as sectionSummary } from './config-summary';
import { section as sectionInfoRequest } from './config-info-request';
import { section as sectionSpotlight } from './config-spotlight';

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
  { ...sectionAsk },
  { ...sectionSummary },
  { ...sectionInfoRequest },
  { ...sectionSpotlight }
];
