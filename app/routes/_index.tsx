import type { V2_MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { ArrowRight } from 'lucide-react'
import { H2, H3, Muted } from '~/components/typography'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { routes } from '~/routes'

export let meta: V2_MetaFunction = () => {
  return [
    {
      title: 'Deltares Data Management Suite',
    },
  ]
}

export default function HomePage() {
  return (
    <div className="px-8 py-16 w-full max-w-screen-lg mx-auto">
      <div className="max-w-lg">
        <H2>Data Management Suite</H2>
        <div className="pt-1">
          <Muted>
            Welcome to the Deltares data management suite. Entry point for
            finding and publishing datasets.
          </Muted>
        </div>
      </div>
      <div className="pt-12 grid grid-cols-1 lg:grid-cols-2 gap-5 w-fit">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Register data</CardTitle>

            <CardDescription>
              Create STAC catalogs, collections and publish metadata.
            </CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            <Button asChild className="group">
              <Link to={routes.items()}>
                Register data
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transform transition-transform" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Find data</CardTitle>

            <CardDescription>
              Explore the central data catalog using the radiantearth STAC
              Browser.
            </CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            <Button asChild className="group">
              <Link to={routes.search()}>
                Search data
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transform transition-transform" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="pt-20">
        <H3>Links</H3>

        <ul className="pt-12 max-w-xl flex flex-col gap-10">
          <li>
            <Link
              to={routes.storageFinder()}
              className="flex justify-between gap-5"
            >
              <div>
                <strong className="font-medium">Storage Finder</strong>
                <Muted>Find the best storage solution for your data.</Muted>
              </div>
              <div className="flex-shrink-0">
                <Badge variant="success" className="uppercase flex-shrink-0">
                  New
                </Badge>
              </div>
            </Link>
          </li>

          <li className="flex justify-between gap-5">
            <div>
              <strong className="font-medium">Data Management Plan</strong>
              <Muted>A general plan for data management within Deltares.</Muted>
            </div>
            <div className="flex-shrink-0">
              <Badge variant="secondary" className="uppercase">
                Coming Soon
              </Badge>
            </div>
          </li>

          <li className="flex justify-between gap-5">
            <div>
              <strong className="font-medium">Data Governance Council</strong>
              <Muted>
                Information on who is in the data council, what they do and
                decisions they’ve made.
              </Muted>
            </div>
            <div className="flex-shrink-0">
              <Badge variant="secondary" className="uppercase flex-shrink-0">
                Coming Soon
              </Badge>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}
