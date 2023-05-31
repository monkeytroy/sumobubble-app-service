import Link from "next/link";

export default function Footer () {
  return (
    <div className="mt-12 py-8 px-4 border-t-2 border-gray-100 text-sm text-gray-500 flex justify-between">
      <div>
        <div className="font-semibold ">
          For more information contact us at info@infochatapp.com
        </div>
        (c)2023 InfoChatApp
      </div>
      <div>
        <Link href="/privacy">Privacy Policy</Link>
      </div>
    </div>
  )
}