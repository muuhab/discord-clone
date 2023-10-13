import { db } from "@/lib/db";
import getSession from "./getSession";

export const currentUser = async () => {
  const session = await getSession();
  if (!session?.user?.email) return null;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  return user;
};
