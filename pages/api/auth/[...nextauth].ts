import Configuration from '@/models/config';
import connectMongo from '@/services/mongoose';
import NextAuth, { Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import SimpleCrypto from 'simple-crypto-js'
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from './lib/mongo-client';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { log } from '@/services/log';

const crypto = new SimpleCrypto(process.env.CRYPTO_KEY);

export const authOptions = {
  // Configure one or more authentication providers
  cookie: {
    secure: process.env.NODE_ENV && process.env.NODE_ENV === 'production',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60
  },
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID || '',
    //   clientSecret: process.env.GOOGLE_SECRET || ''
    // }),
    CredentialsProvider({
      name: 'Creds', 
      credentials: {
        customerId: { label: 'BeaconId', type: 'text', placeholder: 'xxxx' },
        customerPin: {  label: 'PIN', type: 'password' }
      },
      async authorize(credentials, req: any) {
        log('cred provider authorize =================================================');
        const customerId = credentials?.customerId;
        const customerPin = credentials?.customerPin;

        try {      
          await connectMongo();
          
          // fetch the customer    
          const configuration = await Configuration.findOne({ customerId: customerId });
          if (configuration) {
            
            const pin = crypto.decrypt(configuration.pin + '');

            if (pin == customerPin) {

              // this is the user used in jwt
              const user: User = {
                id: configuration.customerId,
                name: configuration.customer.title
              };

              log(`Setting authorized user to ${JSON.stringify(user)}`)

              return user;
            }
          }  
        } catch(err) {
          console.log(err);
        }

        return null;
      }
    })
  ],
  callbacks: {
    async signIn(user: any) {
      log('signIn  ----------------------------------------------------');
      try {
        //the user object is wrapped in another user object so extract it
        log(`Sign in callback user ${JSON.stringify(user)}`);
        user = user.user;

        if (typeof user.id !== typeof undefined) {
          return user;
        } else {
          log('User id was undefined')
          return false;
        }
      }
      catch (err) {
        console.error('Signin callback error:', err);
      }
    },

    async jwt({ token, user, account, profile }: 
      { token: JWT, account?: any, profile?: any, user?: any}) {

      console.log('jwt ----------------------------------------------------');
      console.log(`JWT token: `, token);

      // only provided the first time after sign in. 
      //console.log(`JWT user: `, user);
      //console.log(`JWT account: `, account);
      //console.log(`JWT profile: `, profile);
      
      if (account) {
        //token.user.provider = account.provider;
        token.provider = account.provider;
      }
 
      console.log(`Final JWT token: `, token);
      return token;
    },

    /**
     * No session if adapter is used?
     * @param param0 
     * @returns 
     */
    async session({ session, token }: {session: Session, token: JWT}) {
      console.log('session ----------------------------------------------------');
      // populated already for google.. custom auth too?

      if (session.user) {
        session.user.id = token.sub || '';
      }

      console.log('session ==> ', session);
      console.log('token ==>', token);

      return session;
    },

    createUser() {
      console.log('crete user');
    },
    updateUser() {
      console.log('update user');
    },
    linkAccount() {
      console.log('link user');
    }
  },
  logger: {
    error(code: any, metadata: any) {
      console.error(code, metadata)
    },
    warn(code: any) {
      console.warn(code)
    },
    debug(code: any, metadata: any) {
      //console.debug(code, metadata)
    }
  }
}

export default NextAuth(authOptions)