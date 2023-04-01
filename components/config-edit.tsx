
import { IAppProps } from '@/pages';
import ConfigTabs from './config-tabs';

export default function ConfigEdit(props: IAppProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-10">
      {props.configuration && 
        <ConfigTabs {...props}></ConfigTabs>
      }
      {!props.configuration &&
        <div className="text-3xl text-center py-24">Missing configuration</div>
      }
    </div>
  )
}