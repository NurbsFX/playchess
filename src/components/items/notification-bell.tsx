'use client'

import { Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { useInvitations } from '@/hooks/use-invitations'
import { Button } from '@/components/ui/button'
import { acceptInvitation, declineInvitation } from '@/lib/action'
import { toast } from 'sonner'

export function NotificationBell() {
  const { invitations, count } = useInvitations()

  const handleAccept = async (invitationId: string) => {
    try {
      await acceptInvitation(invitationId)
      toast.success('Partie créée !')
    } catch (error) {
      toast.error('Erreur lors de l\'acceptation de l\'invitation')
    }
  }

  const handleDecline = async (invitationId: string) => {
    try {
      await declineInvitation(invitationId)
      toast.success('Invitation refusée')
    } catch (error) {
      toast.error('Erreur lors du refus de l\'invitation')
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
          className="relative p-2 rounded-full hover:bg-muted transition"
        >
          <Bell className="w-6 h-6" />
          {count > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
              {count}
            </span>
          )}
        </motion.button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2">
        <h4 className="font-medium text-sm mb-2">Notifications</h4>
        {invitations.length === 0 ? (
          <p className="text-muted-foreground text-sm">Aucune notification</p>
        ) : (
          <ul className="space-y-2">
            {invitations.map((invitation) => (
              <li key={invitation.id} className="text-sm space-y-2">
                <p>{invitation.sender.name} vous invite à jouer</p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleAccept(invitation.id)}
                  >
                    Accepter
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDecline(invitation.id)}
                  >
                    Refuser
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  )
}