// components/items/MoveNavigator.tsx
'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface MoveNavigatorProps {
    currentMove: number
    totalMoves: number
    onFirst: () => void
    onPrev: () => void
    onNext: () => void
    onLast: () => void
}

export default function MoveNavigator({
    currentMove,
    totalMoves,
    onFirst,
    onPrev,
    onNext,
    onLast
}: MoveNavigatorProps) {
    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            <Button onClick={onFirst} variant="ghost" size="icon" disabled={currentMove === 0}>
                <ChevronsLeft />
            </Button>
            <Button onClick={onPrev} variant="ghost" size="icon" disabled={currentMove === 0}>
                <ChevronLeft />
            </Button>
            <span className="text-sm text-muted-foreground">
                {currentMove + 1} / {totalMoves}
            </span>
            <Button onClick={onNext} variant="ghost" size="icon" disabled={currentMove >= totalMoves - 1}>
                <ChevronRight />
            </Button>
            <Button onClick={onLast} variant="ghost" size="icon" disabled={currentMove >= totalMoves - 1}>
                <ChevronsRight />
            </Button>
        </div>
    )
}