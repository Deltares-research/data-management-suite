import { useNavigate } from '@remix-run/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { routes } from '~/routes'
import TRLInfo from '~/data/storage-finder-trl-info.mdx'

export default function StorageFinderPage() {
  let navigate = useNavigate()

  return (
    <Dialog open onOpenChange={() => navigate(routes.storageFinder())}>
      <DialogContent className="max-h-[calc(100vh-96px)] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle>Technology Readiness Level</DialogTitle>
        </DialogHeader>
        <div className="prose prose-sm prose-h1:text-lg prose-h2:text-base prose-headings:font-medium">
          <TRLInfo />
        </div>
      </DialogContent>
    </Dialog>
  )
}
