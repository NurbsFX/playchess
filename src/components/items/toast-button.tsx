'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function ToastTestButton() {
    return (
        <Button
            variant="outline"
            onClick={() =>
                toast("Test réussi ✅", {
                    description: "Le toast s'affiche correctement via Sonner.",
                    action: {
                        label: "Fermer",
                        onClick: () => console.log("Toast fermé"),
                    },
                })
            }
        >
            Tester le toast
        </Button>
    )
}