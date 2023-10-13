import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const server = await db.server.create({
      data: {
        name,
        imageUrl,
        userId: user.id,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: "general", userId: user.id }],
        },
        members: {
          create: [{ userId: user.id, role: MemberRole.ADMIN }],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
