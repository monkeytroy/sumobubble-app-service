import Configuration from "@/models/config";
import connectMongo from "@/services/mongoose";
import NextAuth, { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import SimpleCrypto from "simple-crypto-js"

const crypto = new SimpleCrypto(process.env.CRYPTO_KEY);

// test
console.log('Init crypto ---------------------------');
console.log(process.env.CRYPTO_KEY);
const e = crypto.encrypt('1234');
const d = crypto.decrypt(e);
console.log('1234', e, d);

const en = crypto.encrypt(1234);
const dn = crypto.decrypt(e);
console.log('1234 as number', en, dn);

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
        
        let errormsg = 'Invalid or Bad Access';
        const customerId = credentials?.customerId;
        const customerPin = credentials?.customerPin;

        try {      
          await connectMongo();
          
          // fetch the customer    
          const configuration = await Configuration.findOne({ customerId: customerId });
      
          if (configuration) {
            console.log(`Decrypting pin: ${configuration.pin}`);
            const pin = crypto.decrypt(configuration.pin + '');

            if (pin == customerPin) {

              // this is the user used in jwt
              const user: User = {
                id: configuration.customerId,
                name: configuration.customer.title
                // todo have account admin for cust here.
              };

              return user;

            }
          } else {
            errormsg = 'Could not load config for ' + customerId;
          }  
        } catch(err) {
          console.log(err);
        }

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

    async jwt({ token, user }: { token: JWT, user?: User}) {
      if (user) {
          token.user = user;
      }
      return token;
    },

    async session({ session, token }: {session: Session, token: JWT}) {
      //console.log('session', session, 'token', token)
      session.user = token.user;
      
      return session;
    },
  },
}

export default NextAuth(authOptions)