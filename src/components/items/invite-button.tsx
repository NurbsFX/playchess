'use client'

import { Button } from '@/components/ui/button'
import { invitePlayer } from '@/lib/action'
import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface InviteButtonProps {
  receiverId: string
}

export function InviteButton({ receiverId }: InviteButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleInvite = async () => {
    setIsLoading(true)
    try {
      const result = await invitePlayer(receiverId)

      if (result?.alreadyInvited) {
        toast("Invitation déjà envoyée", {
          description: "Ce joueur a déjà une invitation en attente.",
        })
      } else {
        toast("Invitation envoyée", {
          description: "Le joueur a été invité avec succès.",
        })
      }
    } catch (error) {
      toast("Erreur lors de l'invitation", {
        description: error instanceof Error ? error.message : "Erreur inconnue",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleInvite}
      disabled={isLoading}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {isLoading ? 'Envoi...' : 'Inviter'}
    </Button>
  )
}