// NextAuth configuration
import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // TODO: Replace with actual auth service call
        if (credentials?.email && credentials?.password) {
          // Make API call to backend
          // const response = await fetch(`${process.env.NEXTAUTH_API_URL}/auth/login`, {
          //   method: 'POST',
          //   body: JSON.stringify(credentials),
          // })
          // const user = await response.json()
          // return user

          return {
            id: '1',
            email: credentials.email,
            name: 'User',
          }
        }
        return null
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/',
  },
}
