import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {

  interface IUser extends DefaultUser  {
    // any custom fields here.
  }

  interface Session {
     user: IUser
  }

}

declare module "next-auth/jwt" {
  interface JWT extends IUser {
  }
}