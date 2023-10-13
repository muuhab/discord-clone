import { v4 as uuidv4 } from "uuid";

import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("Server Id Missing", { status: 400 });
    }
    const server = await db.server.update({
      where: { id: params.serverId, userId: user.id },
      data: {
        inviteCode: uuidv4(),
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
