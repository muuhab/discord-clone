import { db } from "@/lib/db";
import getSession from "./getSession";

export const currentProfile = async () => {
  const session = await getSession();
  if (!session?.user?.email) return null;

  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
  });

  return profile;
};
