import NextAuth from "next-auth"

export enum Role {
  user = "user",
  admin = "admin",
}

declare module "next-auth" {

  interface User {
    id: string;
    name: string;
    email?: string;
  }

  interface Session extends DefaultSession{
    user?: User
  }

}

declare module "next-auth/jwt" {
  interface JWT {
    user?: User;
    role?: Role;
    subscribed: boolean;
  }
}