
import { IAppState, useAppStore } from '@/store/app-store';
import ConfigSummary from './site-summary';
import SectionSelection from './section-selection';

export default function ConfigEdit() {

  const configuration = useAppStore((state: IAppState) => state.configuration);

  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-10">
      {configuration && 
        <div>
          <ConfigSummary></ConfigSummary>
          <div className="py-4 text-3xl">Info Sections</div>
          <SectionSelection></SectionSelection>
        </div>
      }
      {!configuration &&
        <div className="text-3xl text-center py-24">Missing configuration</div>
      }
    </div>
  )
}
