
export const saveFile = async (id: string, fileblob: Blob) => {

  const formData = new FormData();

  formData.append('file', fileblob);

  const res = await fetch(`/api/files/${id}`, {
    method: 'PUT',
    body: formData
  });

  const json = await res.json();

  return json;
}