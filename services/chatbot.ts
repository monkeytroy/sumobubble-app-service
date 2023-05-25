
export const createChatbot = async (id: string) => {

  const chatbotUrl = `/api/chatbot/${id}`;

  const res = await fetch(chatbotUrl, {
    method: 'PUT'
  });

  // return res
  return res.json();

}