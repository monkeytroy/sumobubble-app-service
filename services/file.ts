
export const saveFile = async (config: IBeaconConfig, fileblob: Blob) => {

  const formData = new FormData();

  formData.append('file', fileblob);

  const res = await fetch(`/api/files/${config.customerId}`, {
    method: 'PUT',
    body: formData
  });

  const json = await res.json();

  return json;
}