import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "INVESTOR" | "OWNER" | "MODERATOR" | "ADMIN";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    role: "INVESTOR" | "OWNER" | "MODERATOR" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "INVESTOR" | "OWNER" | "MODERATOR" | "ADMIN";
  }
}
