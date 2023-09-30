import { FC } from 'react'
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import NavigationSidebar from '@/components/navigation/navigation-sidebar'
import ServerSidebar from '@/components/server/server-sidebar'
import { Menu } from 'lucide-react'

interface MobileToggleProps {
    serverId: string;
}

const MobileToggle: FC<MobileToggleProps> = ({ serverId }) => {
    return <Sheet>
        <SheetTrigger asChild>
            <Button variant={'ghost'} size='icon' className='md:hidden'>
                <Menu />
            </Button>

        </SheetTrigger>
        <SheetContent side={'left'} className='p-0 flex gap-0'>
            <div className='w-[72px]'>
                <NavigationSidebar />
            </div>
            <ServerSidebar serverId={serverId} />
        </SheetContent>

    </Sheet>
}

export default MobileToggle