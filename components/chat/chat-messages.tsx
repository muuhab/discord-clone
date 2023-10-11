"use client"

import { Member, Message, Profile } from '@prisma/client';
import { FC, Fragment } from 'react'
import { format } from 'date-fns';
import ChatWelcome from './chat-welcome';
import { useChatQuery } from '@/hooks/use-chat-query';
import { AlignCenter, Loader2, ServerCrash } from 'lucide-react';
import ChatItem from './chat-item';
import { useChatSocket } from '@/hooks/use-chat-socket';

const DATE_FORMAT = 'd MMM yyyy, HH:mm'
interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>
    paramKey: 'channelId' | 'conversationId';
    paramValue: string
    type: 'channel' | 'conversation';
}
type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}
const ChatMessages: FC<ChatMessagesProps> = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type
}) => {

    const queryKey = `chat:${chatId}`
    const updateKey = `chat:${chatId}:messages:update`
    const addKey = `chat:${chatId}:messages`
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue,
    })
    useChatSocket({
        queryKey,
        updateKey,
        addKey
    })

    if (status === 'loading')
        return (
            <div className="flex flex-col flex-1 justify-AlignCenter items-center">
                <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Loading messages...
                </p>
            </div>)

    if (status === 'error')
        return (
            <div className="flex flex-col flex-1 justify-AlignCenter items-center">
                <ServerCrash className='h-7 w-7 text-zinc-500  my-4' />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Something went wrong!
                </p>
            </div>)

    return <div className='flex-1 flex flex-col py-4 overflow-y-auto'>

        <div className='flex-1' />
        <ChatWelcome
            type={type}
            name={name}
        />
        <div className="flex flex-col-reverse mt-auto">
            {data?.pages?.map((group, i) => (
                <Fragment key={i}>
                    {group.items.map((message: MessageWithMemberWithProfile) => (
                        <ChatItem
                            key={message.id}
                            id={message.id}
                            currentMember={member}
                            member={message.member}
                            content={message.content}
                            deleted={message.deleted}
                            fileUrl={message.fileUrl}
                            timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                            isUpdated={message.updatedAt !== message.createdAt}
                            socketQuery={socketQuery}
                            socketUrl={socketUrl}
                        />
                    ))}
                </Fragment>
            ))}
        </div>
    </div>
}

export default ChatMessages