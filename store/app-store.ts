
import { ICustomer } from '@/models/customer';
import { ISiteState } from '@/models/siteState';
import { addNewSite, removeSite, saveSite } from '@/services/site';
import { ISitesSummary } from '@/services/ssp-default';
import { toast } from 'react-toastify';
import { create } from 'zustand';

export interface IAppState {

  sites: Array<ISitesSummary>,
  site: ISite | null,
  siteState: ISiteState | null,
  siteChanged: boolean;
  customer: ICustomer | null;

  setCustomer: (val: ICustomer) => void; 
  setSites: (val: Array<ISitesSummary>) => void;
  addSite: (siteTitle: string) => void;
  removeSite: (siteId: string) => void;
  setSite: (val: ISite) => void;
  setSiteState: (val: ISiteState) => void;
  setSiteChanged: (val: boolean) => void;
  enableSection: (val: boolean, section: string) => void;
}

export const useAppStore = create<IAppState>( (set, get) => ({

  sites: [],
  site: null,
  siteState: null,
  siteChanged: false,
  customer: null,

  setCustomer: (val: ICustomer) => set (() => ({ customer: {...val}})),

  setSites: (val: Array<ISitesSummary>) => set (() => ({ sites: [...val]})),

  addSite: async (siteTitle: string) => {

    // call the service. 
    const newSiteRes = await addNewSite(siteTitle); 

    // update store
    if (newSiteRes?.success && newSiteRes?.data) {
      set (state => ({ sites: [...state.sites, {...newSiteRes?.data}]}));

      toast.success('Created!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        });

    } else {

      toast.error('Ooops! New site was not created. ' + newSiteRes.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        });
    }
  },

  removeSite: async (siteId: string) => {
    // call the service
    const removeSiteRes = await removeSite(siteId);

    // update the store
    if (removeSiteRes) {
      set(state => ({ sites: [...state.sites.filter((val) => val._id !== siteId)]}));
    }
  },

  setSite: (val: ISite) => set (() => ({ site: {...val} }) ),

  setSiteState: (val: ISiteState) => set (() => ({ siteState: {...val} }) ),

  setSiteChanged: (val: boolean) => set ( () => ({ siteChanged: val})),

  enableSection: async (val: boolean, sectionName: string) => {

    const site = get().site;

    if (site) {
      let selectedSection = site?.sections[sectionName as keyof ISiteSections];

      // enable or create section
      if (selectedSection) {
        selectedSection.enabled = val;
      } else {
        selectedSection = {
          enabled: val,
          content: '',
          props: {}
        }
      }

      site.sections[sectionName as keyof ISiteSections] = {...selectedSection};
      
      // service
      const res = await saveSite(site);

      // back to state
      get().setSite(res);
  
    }

  }

}));

