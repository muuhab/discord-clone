import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

interface ServerSidebarProps {
    serverId: string;
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 w-4 h-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 w-4 h-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 w-4 h-4" />,
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="text-indigo-500 mr-2 w-4 h-4" />,
    [MemberRole.ADMIN]: <ShieldAlert className="text-rose-500 mr-2 w-4 h-4" />,
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
    const profile = await currentProfile();
    if (!profile) return redirect("/");

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc"
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: "asc"
                }
            }
        }
    })
    const textChannels = server?.channels.filter(channel => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels.filter(channel => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels.filter(channel => channel.type === ChannelType.VIDEO)
    const members = server?.members.filter(member => member.profileId !== profile.id)

    if (!server) return redirect("/");

    const role = server.members.find(member => member.profileId === profile.id)?.role


    return <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ServerHeader
            server={server}
            role={role}
        />
        <ScrollArea className="flex-1 px-3">
            <div className="mt-2">
                <ServerSearch
                    data={[
                        {
                            label: "Text Channels",
                            type: "channel",
                            data: textChannels?.map(channel => ({
                                icon: iconMap[channel.type],
                                name: channel.name,
                                id: channel.id
                            }))
                        },
                        {
                            label: "Voice Channels",
                            type: "channel",
                            data: audioChannels?.map(channel => ({
                                icon: iconMap[channel.type],
                                name: channel.name,
                                id: channel.id
                            }))
                        },
                        {
                            label: "Video Channels",
                            type: "channel",
                            data: videoChannels?.map(channel => ({
                                icon: iconMap[channel.type],
                                name: channel.name,
                                id: channel.id
                            }))
                        },
                        {
                            label: "Members",
                            type: "member",
                            data: members?.map(member => ({
                                icon: roleIconMap[member.role],
                                name: member.profile.name,
                                id: member.id
                            }))
                        },
                    ]}
                />
            </div>

        </ScrollArea>
    </div>;
};
export default ServerSidebar;
