'use client'

import { Button } from '@/components/ui/button'
import { invitePlayer } from '@/lib/action'
import { useState } from 'react'
import { toast } from 'sonner'

interface InviteButtonProps {
  receiverId: string
}

export function InviteButton({ receiverId }: InviteButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleInvite = async () => {
    try {
      setIsLoading(true)
      const result = await invitePlayer(receiverId)
      if (result.alreadyInvited) {
        toast.error('Une invitation est déjà en attente')
      } else {
        toast.success('Invitation envoyée')
      }
    } catch (error) {
      toast.error(`Erreur lors de l'envoi de l'invitation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
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
      {isLoading ? 'Envoi...' : 'Inviter'}
    </Button>
  )
}