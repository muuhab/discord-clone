"use client"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,

} from "@/components/ui/tooltip";

import { FC } from 'react'

interface ActionTooltipProps {
    label: string
    children: React.ReactNode
    side?: "left" | "right" | "top" | "bottom"
    align?: "start" | "center" | "end"

}

const ActionTooltip: FC<ActionTooltipProps> = ({
    label,
    children,
    side,
    align
}) => {
    return <TooltipProvider>
        <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side} align={align}>
                <p className="font-bold text-sm capitalize">

                    {label.toLowerCase()}
                </p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
}

export default ActionTooltip