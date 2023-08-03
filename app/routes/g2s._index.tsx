import { redirect, type ActionArgs } from '@remix-run/node'
import { withZod } from '@remix-validated-form/with-zod'
import {
  ValidatedForm,
  useControlField,
  useField,
  validationError,
} from 'remix-validated-form'
import { z } from 'zod'
import { Muted } from '~/components/typography'
import { FormInput, FormSubmit } from '~/components/ui/form'
import { Input } from '~/components/ui/input'

let schema = z.object({
  url: z.string(),
})

let validator = withZod(schema)

export async function action({ request }: ActionArgs) {
  let form = await validator.validate(await request.formData())

  if (form.error) {
    return validationError(form.error)
  }

  let source64 = Buffer.from(form.data.url).toString('base64')

  let url = new URL(request.url)
  let baseUrl = `${url.protocol}//${url.host}/g2s/${source64}/stac`

  return redirect(
    `https://radiantearth.github.io/stac-browser/#/external/${baseUrl}`,
  )
}

export default function G2SPage() {
  let [url, setUrl] = useControlField<string>('url', 'form')

  let apiUrl = ''
  if (typeof window !== 'undefined' && url) {
    let source64 = btoa(url)
    apiUrl = `${window.location.protocol}//${window.location.host}/g2s/${source64}/stac`
  }

  return (
    <div className="flex items-center justify-center h-full w-full min-h-screen">
      <ValidatedForm
        id="form"
        method="post"
        validator={validator}
        className="w-full max-w-[400px] flex flex-col gap-8"
      >
        <FormInput
          label="Geonetwork URL"
          name="url"
          value={url ?? ''}
          onChange={e => setUrl(e.target.value)}
          helper="E.g. https://deltaresdata.openearth.nl"
        />

        <div>
          <FormSubmit>Open in STAC Browser</FormSubmit>
        </div>

        <div className="flex flex-col gap-1.5">
          <Input value={apiUrl} />
          <Muted>Copyable API URL</Muted>
        </div>
      </ValidatedForm>
    </div>
  )
}
