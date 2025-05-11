import "next-auth"

declare module "next-auth" {
  interface User {
    id?: string
    profileImageUrl?: string | null
    role?: 'USER' | 'ADMIN'
    accessToken?: string
  }

  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      profileImageUrl?: string | null
      role?: 'USER' | 'ADMIN'
      accessToken?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    profileImageUrl?: string | null
    role?: string
    accessToken?: string
  }
}
