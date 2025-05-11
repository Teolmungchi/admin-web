import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { apiRequest } from '@/lib/api';

interface LoginData {
  accessToken: string;
  refreshToken: string;
}

interface UserData {
  userId: number;
  name: string;
  email: string;
  profileImageUrl: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const loginResponse = await apiRequest<LoginData>('/v1/auth/login', {
            method: 'POST',
            body: { userId: credentials.email, password: credentials.password },
          });
          console.log('url:', '/v1/auth/login');

          if (!loginResponse.success) {
            console.error('[Auth] Login failed:', {
              code: loginResponse.code,
              message: loginResponse.message,
            });
            return null;
          }

          const { accessToken } = loginResponse.data;

          const userResponse = await apiRequest<UserData>('/v1/user', {
            requiresAuth: true,
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (!userResponse.success) {
            console.error('[Auth] Profile fetch failed:', {
              code: userResponse.code,
              message: userResponse.message,
            });
            return null;
          }

          return {
            id: userResponse.data.data.id,
            email: userResponse.data.login_id,
            name: userResponse.data.data.name,
            profileImageUrl: userResponse.data.profileImageUrl,
            role: userResponse.data.role,
            accessToken,
          };
        } catch (error) {
          console.error('[Auth] Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.profileImageUrl = user.profileImageUrl;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as 'USER' | 'ADMIN';
        session.user.profileImageUrl = token.profileImageUrl as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // 커스텀 로그인 페이지 경로
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30일
    updateAge: 24 * 60 * 60, // 24시간마다 세션 업데이트
  },
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
