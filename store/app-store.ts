
import { saveConfig } from '@/services/config';
import { create } from 'zustand';

export interface IAppState {
  configuration: IBeaconConfig,
  token: string,
  changed: boolean;
  lastSaveTime: number;

  setConfiguration: (val: IBeaconConfig) => void;
  setAppToken: (val: string) => void;
  setChanged: (val: boolean) => void;
  updateLastSaveTime: () => void;
  enableSection: (val: boolean, section: string) => void;
}

export const useAppStore = create<IAppState>((set, get) => ({

  configuration: { customerId: '', customer: { title: ''}, summary: { content: ''}, sections: {}},
  token: '',
  changed: false,
  lastSaveTime: 0,

  setConfiguration: (val: IBeaconConfig) => set (state => ({ configuration: {...val} }) ),

  setAppToken: (val: string) => set( state => ({ token: val})),

  setChanged: (val: boolean) => set ( state => ({ changed: val})),
  
  updateLastSaveTime: () => set( state => ({ lastSaveTime: state.lastSaveTime + 1}) ),

  enableSection: async (val: boolean, section: string) => {

    const config = get().configuration;
    let selectedSection = config.sections[section as keyof IBeaconSections];

    if (selectedSection) {
      selectedSection.enabled = val;
    } else {
      selectedSection = {
        enabled: val,
        content: '',
        props: {}
      }
    }

    config.sections[section as keyof IBeaconSections] = {...selectedSection};
    
    const res = await saveConfig(config, get().token);

    set({
      configuration: {...res}
    });
  }

}));

