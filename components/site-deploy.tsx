import { useAppStore } from "@/store/app-store";
import { useState } from "react";

export default function SiteDeploy() {

  const configuration = useAppStore((state: any) => state.configuration);

  return (
    <div className="flex flex-col gap-4 w-1/2 min-w-fit">
      <div className="flex gap-4 items-baseline">
        <span className="text-xl font-semibold text-gray-900">Deploy</span>
        <span className="text-sm text-gray-600">
          Deploy your InfoChat App
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="block text-sm font-medium leading-6 text-gray-900">
          Copy the following code and paste it into your webpage!
        </div>
        <div className="bg-gray-300 rounded-lg shadow-md p-6">
          <pre><code className="">
{`<script type="module" 
  src="https://beacon-app-5jegr.ondigitalocean.app/app/infochat-app.js" 
  id="infochat-app-scriptastic">
</script>
<infochat-app site="${configuration?._id}"/>`}
          </code></pre>
        </div>
      </div>
    </div>
  )
}