
import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect, useParams } from "next/navigation";

interface ChannelPageProps {
    params: {
        serverId: string;
        channelId: string;
    }
}
const ChannelPage = async ({ params }: ChannelPageProps) => {
    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId,
            server: {
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            }
        }
    })

    const members = await db.member.findFirst({
        where: {
            profileId: profile.id,
            serverId: params.serverId
        }
    })

    if (!channel || !members) return redirect(`/`);

    return <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
        <ChatHeader
            name={channel.name}
            type="channel"
            serverId={channel.serverId}
        />
    </div>;
};
export default ChannelPage;
