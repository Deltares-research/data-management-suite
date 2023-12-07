import { useNavigate, useParams } from '@remix-run/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { storageOptions } from '~/data/storage-finder'
import { routes } from '~/routes'

export default function StorageFinderPage() {
  let { optionId } = useParams<{ optionId: string }>()
  let navigate = useNavigate()

  let storageOption = storageOptions.find(option => option.id === optionId)

  if (!storageOption) return null

  return (
    <Dialog open onOpenChange={() => navigate(routes.storageFinder())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{storageOption.name}</DialogTitle>
          <DialogDescription>{storageOption.description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
