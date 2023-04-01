import { useAppStore } from "@/pages";
import { toast } from "react-toastify";

export const saveConfig = async (config: IBeaconConfig, token: string) => {
  
  const res = await fetch(`/api/config/${config.customerId}`, {
    method: 'POST',
    headers: {
      Authorization: token
    },
    body: JSON.stringify(config)
  });

  // todo check for err

  toast.success('Saved!', {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    });
}