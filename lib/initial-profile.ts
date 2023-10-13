import { db } from "@/lib/db";
import getSession from "./getSession";
import { redirect } from "next/navigation";

export const initialProfile = async () => {
  try {
    const session = await getSession();
    if (!session) {
      redirect("/api/auth/signin?callbackUrl=/server");
    }
    // if (!session?.user?.email) return null;
    const profile = await db.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (profile) return profile;

    const newProfile = await db.profile.create({
      data: {
        userId: session.user.id,
        name: session.user.name as string,
        imageUrl: session.user.image || "https://www.gravatar.com/avatar/HASH",
        email: session.user.email as string,
      },
    });

    return newProfile;
  } catch (error) {
    return null;
  }
};
