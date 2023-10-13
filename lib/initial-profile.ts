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
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (user) return user;

    const newUser = await db.user.create({
      data: {
        id: session.user.id,
        name: session.user.name as string,
        image: session.user.image || "https://www.gravatar.com/avatar/HASH",
        email: session.user.email as string,
      },
    });

    return newUser;
  } catch (error) {
    return null;
  }
};
