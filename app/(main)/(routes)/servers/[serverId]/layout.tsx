import ServerSidebar from "@/components/server/server-sidebar";
import { currentUser } from "@/lib/current-user"
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface ServerIdLayoutProps {
    children: React.ReactNode
    params: {
        serverId: string
    }
}

const ServerIdLayout = async ({ children, params }: ServerIdLayoutProps) => {
    const user = await currentUser();
    console.log(user)
    if (!user) return redirect('/');

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    userId: user.id
                }
            }
        }
    })
    if (!server) return redirect("/");

    return <div className="h-full">
        <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
            <ServerSidebar serverId={params.serverId} />
        </div>
        <main className="h-full md:pl-60">

            {children}
        </main>
    </div>
}

export default ServerIdLayout