export type ContactRes = {
  success: boolean;
  message: string;
};

export type ContactData = {
  section: string;
  category?: string;
  email: string;
  name: string;
  message: string;
  phone?: string;
  moreInfo?: boolean;
  token: string;
};
