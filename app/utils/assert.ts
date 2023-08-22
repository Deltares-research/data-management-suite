export function assert<T>(proposition: T | undefined, errorMessage: string) {
  if (!proposition) throw new Error(errorMessage)

  return proposition
}
