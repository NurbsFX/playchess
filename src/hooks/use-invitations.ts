import { useEffect, useState } from 'react'
import { getReceivedInvitations } from '@/lib/action'

interface Invitation {
  id: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  status: string;
  createdAt: Date;
}

export function useInvitations() {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const data = await getReceivedInvitations()
        setInvitations(data)
      } catch (error) {
        console.error('Erreur lors de la récupération des invitations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvitations()
    // Rafraîchir les invitations toutes les 30 secondes
    const interval = setInterval(fetchInvitations, 30000)

    return () => clearInterval(interval)
  }, [])

  return {
    invitations,
    isLoading,
    count: invitations.length
  }
} 