import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: {
        serverId: string;
        memberId: string;
    },
    searchParams: {
        video?: boolean;
    }
}

const MemberIdPage = async ({
    params,
    searchParams
}: MemberIdPageProps) => {

    const user = await currentUser();
    if (!user) return redirectToSignIn();

    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            userId: user.id
        },
        include: {
            user: true
        }
    })

    if (!currentMember) return redirect("/")

    const conversation = await getOrCreateConversation(currentMember.id, params.memberId)

    if (!conversation) return redirect(`/servers/${params.serverId}`);

    const { memberOne, memberTwo } = conversation;

    const otherMember = memberOne.id === currentMember.id ? memberTwo : memberOne;

    return <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
        <ChatHeader
            imageUrl={otherMember.user.image!}
            name={otherMember.user.name!}
            serverId={params.serverId}
            type="conversation"
        />
        {searchParams.video && (
            <MediaRoom
                chatId={conversation.id}
                video={true}
                audio={true}
            />
        )}
        {!searchParams.video && (
            <>
                <ChatMessages
                    member={currentMember}
                    name={otherMember.user.name!}
                    chatId={conversation.id}
                    type="conversation"
                    apiUrl="/api/direct-messages"
                    paramKey="conversationId"
                    paramValue={conversation.id}
                    socketUrl="/api/socket/direct-messages"
                    socketQuery={{
                        conversationId: conversation.id
                    }}
                />
                <ChatInput
                    name={otherMember.user.name!}
                    type="conversation"
                    apiUrl="/api/socket/direct-messages"
                    query={{
                        conversationId: conversation.id
                    }}
                />
            </>
        )}

    </div>;
};
export default MemberIdPage;
