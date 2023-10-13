import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const currentProfilePages = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // const { userId } = getAuth(req);
  const session = await getServerSession(req, res, authOptions);
  console.log(session);
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
  });

  return profile;
};
