"use client"

import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'


const LogOutButton = ({ }) => {
    return <LogOut className="w-6 h-6 cursor-pointer" onClick={() => signOut({ callbackUrl: "/" })} />
}

export default LogOutButton