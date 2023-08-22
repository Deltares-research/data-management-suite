import type { V2_MetaFunction } from '@remix-run/node'
import { Button } from '~/components/ui/button'

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Login' }]
}

export default function Login() {
  return (
    <form
      action="/auth/microsoft"
      method="post"
      className="h-screen w-screen flex items-center justify-center"
    >
      <Button>
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="w-4 h-4 mr-2"
        >
          <title>Microsoft</title>
          <path d="M0 0v11.408h11.408V0zm12.594 0v11.408H24V0zM0 12.594V24h11.408V12.594zm12.594 0V24H24V12.594z" />
        </svg>{' '}
        Login with Microsoft
      </Button>
    </form>
  )
}
