import LoginBtn from '@/components/login-btn';
import ConfigEdit from '@/components/config-edit';

export default function Home() {
  return (
    <div className="p-6 flex flex-col gap-8">
      <div className="flex w-full justify-between items-center">
        <div className="text-4xl font-bold tracking-tight text-gray-900 ">
          Beacon
        </div>
        <div>
          <LoginBtn></LoginBtn>
        </div>
      </div>
      <div>
        <ConfigEdit></ConfigEdit>
      </div>

    </div>
  )
}
