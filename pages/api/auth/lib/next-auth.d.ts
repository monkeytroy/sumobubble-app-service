import NextAuth from "next-auth"

export enum Role {
  user = "user",
  admin = "admin",
}

declare module "next-auth" {

  interface MyUser extends DefaultUser {
    // custom values can be added here for users.
    id: string;
    name: string;
  }

  interface Session {
    user: MyUser
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: MyUser;
    role?: Role;
    subscribed: boolean;
  }
}