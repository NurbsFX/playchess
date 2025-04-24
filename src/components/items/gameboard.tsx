// app/components/GameBoard.tsx
'use client'

import { Chessboard } from 'react-chessboard'

interface GameBoardProps {
    fen: string
    orientation: 'white' | 'black'
    variant?: 'mini' | 'full'
    onDrop?: (from: string, to: string) => boolean
}

export default function GameBoard({
    fen,
    orientation,
    variant = 'full', // 👉 version "full" par défaut désormais
    onDrop,
}: GameBoardProps) {
    const isMini = variant === 'mini'

    return (
        <Chessboard
            position={fen}
            boardWidth={isMini ? 250 : 400}
            arePiecesDraggable={!isMini}
            onPieceDrop={isMini ? undefined : onDrop}
            boardOrientation={orientation}
            customBoardStyle={{
                borderRadius: isMini ? '4px' : '4px',
                boxShadow: isMini ? '0 1px 8px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
        />
    )
}