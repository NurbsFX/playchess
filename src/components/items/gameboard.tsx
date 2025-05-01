// app/components/GameBoard.tsx
'use client'

import React, { useMemo } from 'react'
import { Chessboard } from 'react-chessboard'

interface GameBoardProps {
    fen: string
    orientation: 'white' | 'black'
    variant?: 'mini' | 'full'
    onDrop?: (from: string, to: string) => boolean
    showStats?: boolean
}

const ORIGINAL_COUNTS = {
    P: 8, N: 2, B: 2, R: 2, Q: 1, K: 1,
    p: 8, n: 2, b: 2, r: 2, q: 1, k: 1,
}
const ORIGINAL_VALUE = {
    P: 1, N: 3, B: 3, R: 5, Q: 10, K: 1,
}

const UNICODE: Record<string, string> = {
    P: '♙', N: '♘', B: '♗', R: '♖', Q: '♕', K: '♔',
    p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚',
}

function calculateMaterialAdvantage(fen: string): number {
    // découpe la portion placement
    const placement = fen.split(' ')[0]
    let whitePoints = 0
    let blackPoints = 0

    for (const ch of placement) {
        // ne garder que les pièces
        if (/[PNBRQKpnbrqk]/.test(ch)) {
            const val = ORIGINAL_VALUE[ch.toUpperCase() as keyof typeof ORIGINAL_VALUE] || 0
            if (ch === ch.toUpperCase()) {
                whitePoints += val
            } else {
                blackPoints += val
            }
        }
    }

    // si >0 => Blanc a plus de points, si <0 => Noir a plus
    return whitePoints - blackPoints
}

export default function GameBoard({
    fen,
    orientation,
    variant = 'full',
    showStats = true,
    onDrop,
}: GameBoardProps) {
    const isMini = variant === 'mini'
    const boardSize = isMini ? 250 : 400

    // compute captured pieces based on missing from original counts
    const { capturedWhite, capturedBlack } = useMemo(() => {
        const placement = fen.split(' ')[0]
        const currentCounts: Record<string, number> = {}
        for (const char of placement) {
            if (/[PNBRQKpnbrqk]/.test(char)) {
                currentCounts[char] = (currentCounts[char] || 0) + 1
            }
        }
        const whiteCaptured: string[] = []
        const blackCaptured: string[] = []
        for (const [piece, original] of Object.entries(ORIGINAL_COUNTS)) {
            const current = currentCounts[piece] || 0
            const missing = original - current
            if (missing > 0) {
                const unicode = UNICODE[piece]
                for (let i = 0; i < missing; i++) {
                    if (piece === piece.toUpperCase()) {
                        whiteCaptured.push(unicode)
                    } else {
                        blackCaptured.push(unicode)
                    }
                }
            }
        }
        return { capturedWhite: whiteCaptured, capturedBlack: blackCaptured }
    }, [fen])

    // Determine which side gets which captured pieces:
    // - When orientation is "white", top = capturedWhite (white pieces on black side), bottom = capturedBlack
    // - When orientation is "black", top = capturedBlack (black pieces on white side), bottom = capturedWhite
    const topCaptured = orientation === 'white' ? capturedWhite : capturedBlack
    const bottomCaptured = orientation === 'white' ? capturedBlack : capturedWhite


    // Calcule l'avance matérielle du joueur courant :
    const materialDiff = useMemo(() => calculateMaterialAdvantage(fen), [fen])
    const absDiff = Math.abs(materialDiff)
    const whiteLeads = materialDiff > 0
    const blackLeads = materialDiff < 0

    return (
        <div className="flex flex-col items-center">
            {/* captured pieces on the side of the opponent (top) */}
            {showStats && (
                <div
                    className="flex flex-wrap justify-start mb-2"
                    style={{ width: boardSize }}
                >
                    {topCaptured.map((p, i) => (
                        <span key={i} className="text-xl mx-0.5">{p}</span>
                    ))}

                    {/* si c’est le **blanc** qui mène ET qu’on voit le blanc en haut (orientation = 'black'), 
          ou si c’est le **noir** qui mène ET qu’on voit le noir en haut (orientation = 'white') */}
                    {whiteLeads && orientation === 'black' && (
                        <span className="ml-2 text-lg font-medium">+{absDiff}</span>
                    )}
                    {blackLeads && orientation === 'white' && (
                        <span className="ml-2 text-lg font-medium">+{absDiff}</span>
                    )}
                </div>
            )}

            <Chessboard
                position={fen}
                boardWidth={boardSize}
                arePiecesDraggable={!isMini}
                onPieceDrop={isMini ? undefined : onDrop}
                boardOrientation={orientation}
                customBoardStyle={{
                    borderRadius: '4px',
                    boxShadow: isMini
                        ? '0 1px 8px rgba(0, 0, 0, 0.3)'
                        : '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
            />

            {/* captured pieces on the player's side (bottom) */}
            {showStats && (
                <div
                    className="flex flex-wrap justify-start mt-2"
                    style={{ width: boardSize }}
                >
                    {bottomCaptured.map((p, i) => (
                        <span key={i} className="text-xl mx-0.5">{p}</span>
                    ))}

                    {/* si c’est le **blanc** qui mène ET qu’on voit le blanc en bas (orientation = 'white'),
          ou si c’est le **noir** qui mène ET qu’on voit le noir en bas (orientation = 'black') */}
                    {whiteLeads && orientation === 'white' && (
                        <span className="ml-2 text-lg font-medium">+{absDiff}</span>
                    )}
                    {blackLeads && orientation === 'black' && (
                        <span className="ml-2 text-lg font-medium">+{absDiff}</span>
                    )}
                </div>
            )}
        </div>
    )
}