import NextAuth, { IUser, Session } from 'next-auth';
import clientPromise from './lib/mongo-client';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { log } from '@/services/log';
import { JWT } from 'next-auth/jwt/types';
import Auth0Provider from 'next-auth/providers/auth0';

export const authOptions = {
  // Configure one or more authentication providers
  cookie: {
    secure: process.env.NODE_ENV && process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60
  },
  secret: process.env.JWT_SECRET,
  pages: {
    //signIn: '/login',
    error: '/error'
  },
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID || '',
      clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
      issuer: process.env.AUTH0_ISSUER,
      authorization: `https://${process.env.AUTH0_ISSUER}/authorize?response_type=code&prompt=login`
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
          log('User id was undefined');
          return false;
        }
      } catch (err) {
        console.error('Signin callback error:', err);
      }
    },

    async jwt({ token, user, account, profile }: { token: JWT; account?: any; profile?: any; user?: IUser }) {
      //console.log('jwt ----------------------------------------------------');
      //console.log(`JWT token: `, token);
      // only provided the first time after sign in.
      //console.log(`JWT user: `, user);
      //console.log(`JWT account: `, account);
      //console.log(`JWT profile: `, profile);

      // any custom fields here.
      // if (user) {
      //   token.role = user.role;
      // }

      //log(`Final JWT token: `, token);
      return token;
    },

    /**
     * No session if adapter is used?
     * @param param0
     * @returns
     */
    async session({ session, token }: { session: Session; token: JWT }) {
      log('session ----------------------------------------------------');

      if (session?.user) {
        session.user.id = token.sub || '';
        // any custom role here.
        //session.user.role = token.role as Role;
      }

      //log('session ==> ', session);
      //log('token ==>', token);

      return session;
    }

    // createUser() {
    //   console.log('crete user');
    // },
    // updateUser() {
    //   console.log('update user');
    // },
    // linkAccount() {
    //   console.log('link user');
    // }
  },
  logger: {
    error(code: any, metadata: any) {
      console.error(code, metadata);
    },
    warn(code: any) {
      console.warn(code);
    },
    debug(code: any, metadata: any) {
      //console.debug(code, metadata)
    }
  }
};

export default NextAuth(authOptions);
