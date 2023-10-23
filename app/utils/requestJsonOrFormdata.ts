export async function requestJsonOrFormData(request: Request) {
  try {
    let formData = await request.formData()
    return formData
  } catch (e) {
    // Do Nothing
  }

  try {
    let body = await request.json()
    body.get = function (key: string) {
      return body[key]
    }

    body.getAll = function (key: string) {
      return [body[key]].filter(Boolean)
    }
    return body
  } catch (e) {
    // Do Nothing
  }

  throw new Error('No JSON or FormData found in request')
}
