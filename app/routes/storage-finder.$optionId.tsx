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

  let Component = storageOption.component

  return (
    <Dialog open onOpenChange={() => navigate(routes.storageFinder())}>
      <DialogContent className="max-h-[calc(100vh-96px)] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle>{storageOption.name}</DialogTitle>
          <DialogDescription>{storageOption.description}</DialogDescription>
        </DialogHeader>
        <div className="prose prose-sm prose-h1:text-lg prose-h2:text-base prose-headings:font-medium">
          <Component />
        </div>
      </DialogContent>
    </Dialog>
  )
}
