import { connectToDb } from "@/services/mongodb";
import { WithId } from "mongodb";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import SimpleCrypto from "simple-crypto-js"

const crypto = new SimpleCrypto(process.env.CRYPTO_KEY);

export const authOptions = {
  // Configure one or more authentication providers
  cookie: {
    secure: process.env.NODE_ENV && process.env.NODE_ENV === 'production',
  },
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60
  },
  providers: [
    CredentialsProvider({
      name: 'Creds',
      credentials: {
        customerId: { label: "BeaconId", type: "text", placeholder: "xxxx" },
        customerPin: {  label: "PIN", type: "password" }
      },
      async authorize(credentials, req: any) {
        
        const customerId = credentials?.customerId;
        const customerPin = credentials?.customerPin;

        try {      
          // fetch the customer
          const { db } = await connectToDb();
      
          const custConfig: CustomerConfig = 
            await db.collection<CustomerConfig>("configurations").findOne({ customerId }) as WithId<CustomerConfig>
      
          if (custConfig) {
            const pin = '' + crypto.decrypt(custConfig.customerPin);
            if (pin === customerPin) {
              return {
                id: custConfig.customerId,
                name: custConfig.customer.title
              };
            }
          }     
        } catch(err) {
        }

        console.log('Pin not right!');
        return null;
      }
    })
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn(user: any) {
      try {
        //the user object is wrapped in another user object so extract it
        user = user.user;
        console.log("Sign in callback", user);
        if (typeof user.id !== typeof undefined) {
          return user;
        } else {
          console.log("User id was undefined")
          return false;
        }
      }
      catch (err) {
        console.error("Signin callback error:", err);
      }
    },
    async jwt({ token, user }:{ token: JWT, user?: any}) {
      if (user) {
          token.user = user;
      }
      return token;
    },

    async session({ session, token }: {session:any, token:any}) {
      session.user = token.user;
      return session;
    },
  },
}

export default NextAuth(authOptions)