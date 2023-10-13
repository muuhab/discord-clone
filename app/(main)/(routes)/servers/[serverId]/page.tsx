import { currentUser } from '@/lib/current-user'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

interface ServerIdProps {
    params: {
        serverId: string
    }
}

const ServerId = async ({ params }: ServerIdProps) => {
    const user = await currentUser()
    if (!user) return redirect('/')
    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    userId: user.id
                }
            }
        },
        include: {
            channels: {
                where: {
                    name: 'general'
                },
                orderBy: {
                    createdAt: 'asc'
                }
            },
        }
    })

    const initialChannel = server?.channels[0]
    if (initialChannel?.name !== 'general') return null

    return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`)

}

export default ServerId