
import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
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

    const member = await db.member.findFirst({
        where: {
            profileId: profile.id,
            serverId: params.serverId
        }
    })

    if (!channel || !member) return redirect(`/`);

    return <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
        <ChatHeader
            name={channel.name}
            type="channel"
            serverId={channel.serverId}
        />
        <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
                serverId: channel.serverId,
                channelId: channel.id
            }}
            paramKey="channelId"
            paramValue={channel.id}
        />
        <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
                serverId: channel.serverId,
                channelId: channel.id
            }}
        />
    </div>;
};
export default ChannelPage;
