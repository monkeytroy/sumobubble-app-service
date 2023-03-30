
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import ConfigTabs from './config-tabs';
import VerseTranslationSelect from './verse-translation-select';

const ConfigEdit = () => {

  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-10">
      <ConfigTabs></ConfigTabs>
    </div>
  )
}

export default ConfigEdit;