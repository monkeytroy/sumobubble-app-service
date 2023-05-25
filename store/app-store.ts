
import { createChatbot } from '@/services/chatbot';
import { addNewSite, removeSite, saveSite } from '@/services/site';
import { ISitesSummary } from '@/services/ssp-default';
import { toast } from 'react-toastify';
import { create } from 'zustand';

export interface IAppState {

  sites: Array<ISitesSummary>,
  configuration: IBeaconSite | null,
  changed: boolean;
  lastSaveTime: number;

  setSites: (val: Array<ISitesSummary>) => void;
  addSite: (siteTitle: string) => void;
  removeSite: (siteId: string) => void;
  setConfiguration: (val: IBeaconSite) => void;
  setChanged: (val: boolean) => void;
  updateLastSaveTime: () => void;
  enableSection: (val: boolean, section: string) => void;
  activateChatbot: (val: IBeaconSite) => void;
}

export const useAppStore = create<IAppState>((set, get) => ({

  sites: [],
  configuration: null,
  token: '',
  changed: false,
  lastSaveTime: 0,

  setSites: (val: Array<ISitesSummary>) => set (state => ({ sites: [...val]})),

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

  setConfiguration: (val: IBeaconSite) => set (state => ({ configuration: {...val} }) ),

  setChanged: (val: boolean) => set ( state => ({ changed: val})),
  
  updateLastSaveTime: () => set( state => ({ lastSaveTime: state.lastSaveTime + 1}) ),

  enableSection: async (val: boolean, section: string) => {

    const config = get().configuration;
    if (config) {
      let selectedSection = config?.sections[section as keyof ISiteSections];

      if (selectedSection) {
        selectedSection.enabled = val;
      } else {
        selectedSection = {
          enabled: val,
          content: '',
          props: {}
        }
      }

      config.sections[section as keyof ISiteSections] = {...selectedSection};
      
      const res = await saveSite(config);

      set({
        configuration: {...res}
      });
  
    }

  },

  activateChatbot: async (site: IBeaconSite) => {
  
    if (site?._id) {

      const res = await createChatbot(site?._id);

      if (res?.success) {
        set (state => ({ configuration: {...res.data}}));

        toast.success('Created!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          });

      } else {

        toast.error('Ooops! New chatbot could not be created. ' + res?.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          });
      }
    }
  }

}));

