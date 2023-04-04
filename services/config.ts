import { toast } from "react-toastify";

export const saveConfig = async (config: IBeaconConfig, token: string) => {
  
  const res = await fetch(`/api/config/${config.customerId}`, {
    method: 'POST',
    headers: {
      Authorization: token
    },
    body: JSON.stringify(config)
  });

  const json = await res.json();

  if (json.success) {

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

      return json.data;
  } else {
    toast.error('Ooops! Could not save!', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      });

    return null;
  }
}