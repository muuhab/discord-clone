"use client"

import { useEffect, useState } from "react"
import { LiveKitRoom, VideoConference } from "@livekit/components-react"
import "@livekit/components-styles"
// import { useUser } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"


interface MediaRoomProps {
    chatId: string
    video: boolean
    audio: boolean
}

export const MediaRoom = ({
    chatId,
    video,
    audio
}: MediaRoomProps) => {
    // const { user } = useUser()
    const { data: session } = useSession()
    const user = session?.user
    const [token, setToken] = useState("")
    useEffect(() => {
        if (!user?.name)
            return

        (
            async () => {
                try {
                    const res = await fetch(`/api/livekit?room=${chatId}&username=${user?.name}`)
                    const data = await res.json()
                    setToken(data.token)
                } catch (error) {
                    console.log(error)
                }
            }
        )()
    }, [
        user?.name,
        chatId
    ]);
    if (token === "") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2
                    className="h-7 w-7 text-zinc-500 animate-spin my-4"
                />
                <p className="text-xs-text-zinc-500 dark:text-zinc-400">
                    Loading...
                </p>

            </div>
        )
    }
    return (
        <LiveKitRoom
            data-lk-theme='default'
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            audio={audio}
            video={video}
            connect={true}
        >
            <VideoConference />
        </LiveKitRoom>
    )
}