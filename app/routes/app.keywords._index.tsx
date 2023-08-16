import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { db } from '~/utils/db.server'

import React from 'react'

import { buildTree } from '~/utils/buildTree'
import { Check, ChevronRight, DotIcon, Plus, X } from 'lucide-react'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import type { ActionArgs, SerializeFrom } from '@remix-run/node'
import {
  FormInput,
  FormSelect,
  FormSubmit,
  FormTextarea,
} from '~/components/ui/form'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'
import { withZod } from '@remix-validated-form/with-zod'
import type { Prisma } from '@prisma/client'
import { authenticator } from '~/services/auth.server'
import { SelectItem } from '~/components/ui/select'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'

export async function loader() {
  let keywords = await db.keyword.findMany({
    include: {
      standard: {
        select: {
          name: true,
        },
      },
    },
  })

  let standards = await db.standard.findMany()

  return { keywords, standards }
}

export async function action({ request }: ActionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth/microsoft',
  })

  let formData = await request.formData()

  let form = await keywordValidator.validate(formData)

  if (form.error) {
    throw validationError(form.error)
  }

  let { id, ...data } = form.data

  return db.keyword.upsert({
    where: {
      id: id ?? '',
    },
    create: data,
    update: data,
  })
}

type KeywordTree = ReturnType<
  typeof buildTree<SerializeFrom<typeof loader>['keywords'][0]>
>[0]

let keywordSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string().nullish(),
  parentId: z.string().nullish(),
  standardId: z.string().nullish(),
}) satisfies z.ZodType<Prisma.KeywordCreateInput>

let keywordValidator = withZod(keywordSchema)

export default function KeywordListPage() {
  let { keywords, standards } = useLoaderData<typeof loader>()
  let newKeyword = useActionData<typeof action>()

  React.useEffect(() => {
    setSelectedKeyword(newKeyword as KeywordTree)
  }, [newKeyword])

  let [search, setSearch] = React.useState('')

  let keywordsTree = React.useMemo(
    () => buildTree(keywords, 'id', 'parentId'),
    [keywords],
  )

  let [selectedKeyword, setSelectedKeyword] = React.useState<
    KeywordTree | undefined
  >(undefined)

  let selectedParent = keywords.find(kw => kw.id === selectedKeyword?.parentId)

  return (
    <div className="max-h-[calc(100vh-64px)]">
      <div className="p-8 flex flex-col h-full">
        <div className="grid grid-cols-3 h-full overflow-hidden">
          <Card className="h-full overflow-hidden flex flex-col">
            <CardHeader className="flex flex-col gap-1.5">
              <h3 className="font-medium">Keywords</h3>

              <div className="flex gap-1 items-center">
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => setSearch('')}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => setSelectedKeyword(undefined)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent
              className="flex-1 overflow-y-auto border-t pt-3"
              onClick={() => setSelectedKeyword(undefined)}
            >
              <ul className="list-outside" onClick={e => e.stopPropagation()}>
                {keywordsTree.map(keyword => (
                  <KeywordTree
                    key={keyword.id}
                    keyword={keyword}
                    search={search}
                    selectedKeyword={selectedKeyword}
                    onSelect={setSelectedKeyword}
                  />
                ))}
              </ul>
            </CardContent>
          </Card>

          <ValidatedForm
            key={selectedKeyword?.id}
            method="post"
            className="col-span-2 px-8 py-3 flex flex-col gap-5"
            validator={keywordValidator}
            defaultValues={selectedKeyword}
          >
            {selectedKeyword?.id && (
              <input type="hidden" name="id" value={selectedKeyword?.id} />
            )}
            {selectedKeyword?.parentId && (
              <input
                type="hidden"
                name="parentId"
                value={selectedKeyword?.parentId ?? undefined}
              />
            )}

            <FormInput label="Title" name="title" />
            <FormTextarea rows={10} label="Description" name="description" />

            <FormSelect name="standardId" label="Standard">
              {standards.map(standard => (
                <SelectItem key={standard.id} value={standard.id}>
                  {standard.name}
                </SelectItem>
              ))}
            </FormSelect>

            <div className="flex gap-1.5">
              <FormSubmit>{selectedKeyword ? 'Save' : 'Create'}</FormSubmit>
              {selectedKeyword && (
                <FormSubmit
                  name="subaction"
                  value="DELETE"
                  variant="destructive"
                >
                  Delete
                </FormSubmit>
              )}
            </div>
          </ValidatedForm>
        </div>
      </div>
    </div>
  )
}

function traverse(
  keyword: KeywordTree,
  predicate: (keyword: KeywordTree) => boolean,
): boolean {
  if (predicate(keyword)) return true

  return keyword.children?.some(child => traverse(child, predicate)) ?? false
}

function KeywordTree({
  keyword,
  onSelect,
  selectedKeyword,
  search,
}: {
  keyword: KeywordTree
  selectedKeyword?: KeywordTree
  onSelect(keyword: KeywordTree): void
  search: string
}) {
  let [isOpen, setIsOpen] = React.useState(false)
  let [isCreating, setIsCreating] = React.useState(false)
  let inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isCreating])

  let isDirectHit = keyword.title.toLowerCase().includes(search.toLowerCase())

  let isFound =
    !search ||
    traverse(keyword, kw =>
      kw.title.toLowerCase().includes(search.toLowerCase()),
    )

  if (!isFound) return

  return (
    <li className="w-full relative">
      <div className="flex justify-between group gap-1">
        <button
          className={`flex items-center gap-2 py-0.5 rounded-sm w-full ${
            selectedKeyword?.id === keyword.id ? 'bg-accent' : 'hover:bg-accent'
          } ${isDirectHit ? 'text-foreground' : 'text-muted-foreground'}`}
          onClick={() => {
            onSelect(keyword)
            setIsOpen(c => !c)
          }}
        >
          {keyword.children?.length > 0 ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <DotIcon className="w-4 h-4" />
          )}
          {keyword.title}
        </button>
        <Button
          size="icon-xs"
          variant="secondary"
          className="opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100"
          onClick={() => {
            setIsCreating(true)
            setIsOpen(true)
          }}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {isCreating && (
        <ValidatedForm
          method="post"
          validator={newKeywordValidator}
          className="pl-3 flex items-center gap-0.5"
          onSubmit={() => setIsCreating(false)}
        >
          <input type="hidden" name="parentId" value={keyword.id} />
          <input
            type="hidden"
            name="standardId"
            value={keyword.standardId ?? ''}
          />

          <DotIcon className="w-4 h-4 mr-1.5" />

          <FormInput
            ref={inputRef}
            aria-label="Keyword title"
            name="title"
            inputSize="xs"
          />
          <FormSubmit size="icon-xs" value="NEW">
            <Check className="w-3 h-3" />
          </FormSubmit>
          <Button
            variant="destructive"
            size="icon-xs"
            type="button"
            onClick={() => setIsCreating(false)}
          >
            <X className="w-3 h-3" />
          </Button>
        </ValidatedForm>
      )}

      {(isOpen || !isDirectHit) && (
        <ul className="pl-3 list-outside">
          {keyword.children?.map(keyword => (
            <KeywordTree
              key={keyword.id}
              keyword={keyword}
              search={search}
              selectedKeyword={selectedKeyword}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

let newKeywordSchema = z.object({
  title: z.string(),
  parentId: z.string().nullish(),
}) satisfies z.ZodType<Prisma.KeywordCreateInput>

let newKeywordValidator = withZod(newKeywordSchema)
