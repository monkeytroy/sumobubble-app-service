import { ReactElement } from "react";

//import { section as sectionTest } from '@/components/sections/config-test';
import { section as sectionContact } from '@/components/sections/config-contact';
import { section as sectionPrayer } from '@/components/sections/config-prayer';
import { section as sectionVerse } from '@/components/sections/config-verse';
import { section as sectionSpotlight } from '@/components/sections/config-spotlight';
import { section as sectionFunny } from '@/components/sections/config-funny';

export interface ISection {
  name: string,
  title: string,
  description: string,
  href: string,
  icon: ReactElement,
  class: string,
  component?: ReactElement
}

export const sections: Array<ISection> = [
  //{ ...sectionTest },
  { ...sectionContact},
  { ...sectionPrayer },
  { ...sectionVerse },
  { ...sectionSpotlight },
  { ...sectionFunny }
];