"use client"

import { cn } from '@/lib/utils'
import { Member, MemberRole, User, Server } from '@prisma/client'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { FC } from 'react'
import UserAvatar from '../user-avatar'

interface ServerMemberProps {
    member: Member & { user: User }
    server: Server
}
const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="text-indigo-500 ml-2 w-4 h-4" />,
    [MemberRole.ADMIN]: <ShieldAlert className="text-rose-500 ml-2 w-4 h-4" />,
}

const ServerMember: FC<ServerMemberProps> = ({
    member,
    server
}) => {

    const params = useParams()
    const router = useRouter()

    const icon = roleIconMap[member.role]

    const onClick = () => {
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
    }

    return <button
        onClick={onClick}
        className={cn(
            'group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
            params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
        )}>
        <UserAvatar
            src={member.user.image!}
            className='h-8 w-8 md:h-8 md:w-8'
        />
        <p className={cn(
            'font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
            params?.memberId === member.id && 'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}>
            {member.user.name}
        </p>
        {icon}

    </button>
}

export default ServerMember