import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { ArrowRight } from 'lucide-react'
import { H1, H2, H3, Muted } from '~/components/typography'
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

export default function ComingSoon() {
  return (
    <div className="px-8 py-16 w-full h-full max-w-screen-md mx-auto flex justify-center items-center flex-col">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 773 149"
          className="w-40 mb-20"
        >
          <path
            fill="#141f95"
            d="M124.1,71.2C124.1,21.4,95.4,1,48.9,1c-14.6,0-28.7,0-36,0.4C5.6,1.9,1,2.8,1,9.9v135.9c13.8,1.4,27.6,2.2,41.5,2.2
	C89.9,148,124.1,120.9,124.1,71.2z M93.6,73.4c0,32-20.1,51.1-48.3,51.1c-5.2,0-10.4-0.3-15.5-1.1V24.8c0,0,8.2-0.7,17.3-0.7
	C79.9,24.1,93.6,41.4,93.6,73.4z M139.6,93.4c0,36.4,18.2,54.6,55.6,54.6c11.8,0.1,23.6-1.9,34.7-5.8v-20.9c-10,3.4-20.4,5.2-31,5.3
	c-20.1,0-31-10.2-31-29.8H224c9.1,0,12.8-2.2,12.8-8.4v-4c0-26.6-14.6-47.5-45.6-47.5C158.3,37,139.6,61.4,139.6,93.4z M190.3,57.4
	c11.9,0,18.2,8,18.2,21.3h-40.1C170.2,65.4,178.4,57.4,190.3,57.4z M286,1.4h-15.5c-9.1,0-12.8,2.2-12.8,8.4v103
	c0,24.9,7.8,35.1,28.7,35.1c6.3-0.1,12.6-1,18.7-2.9v-20.2c-3.1,0.8-6.3,1.2-9.6,1.3c-5.7,0-9.6-2.7-9.6-14.2V1.4z M350.8,1.4h-15.1
	c-9.1,0-12.8,2.2-12.8,8.4v103c0,24.9,8.2,35.1,31.9,35.1c7.5,0,15.1-0.9,22.3-2.9V124c-4.3,1.1-8.8,1.7-13.2,1.8
	c-8.2,0-13.2-4-13.2-17.3v-48h13.7c9.1,0,12.8-2.2,12.8-8.4V39.2h-26.5V1.4z M390.9,97.8c0,36.4,23.7,50.2,52.9,50.2
	c18.2,0,36.9-3.6,47.9-8V42.7C479,39,465.8,37.1,452.5,37C414.2,37,390.9,61.4,390.9,97.8z M420.1,95.1c0-25.8,13.2-36.9,29.6-36.9
	c4.8,0,9.5,0.5,14.1,1.6V124c0,0-5.9,2.7-17.8,2.7C427.9,126.7,420.1,114.7,420.1,95.1z M520.5,145.8h28.3V80.9
	c0-15.1,4.1-20.4,15-20.4h1.4c8.2,0,12.3-1.3,12.3-8.4V39.2h-17.3c-31,0-39.7,18.7-39.7,41.7V145.8z M583.9,93.4
	c0,36.4,18.2,54.6,55.6,54.6c11.8,0.1,23.6-1.9,34.7-5.8v-20.9c-10,3.4-20.5,5.2-31,5.3c-20.1,0-31-10.2-31-29.8h56.1
	c9.1,0,12.8-2.2,12.8-8.4v-4c0-26.6-14.6-47.5-45.6-47.5C602.6,37,583.9,61.4,583.9,93.4z M634.5,57.4c11.9,0,18.2,8,18.2,21.3
	h-40.1C614.4,65.4,622.6,57.4,634.5,57.4z M698.3,71.2c0,35.5,44.5,25.8,44.5,44.4c0,7.1-7.1,11.1-18,11.1c-7.9,0-15.8-1.1-23.5-3.1
	l-0.5,22.2c7.4,1.5,15,2.2,22.6,2.2c29.2,0,48.6-13.8,48.6-35.1c0-34.6-44.9-27.5-44.9-44.4c0-7.1,6.4-10.7,16.4-10.7
	c3.6,0,7.3,0.2,10,0.2c6.4,0,11.4-1.1,11.4-11.8v-7.5c-6.6-1.1-13.3-1.7-20.1-1.8C713.8,37,698.3,52.5,698.3,71.2z"
          ></path>
        </svg>
        <H1>Coming Soon</H1>
        <div className="pt-5">
          <Muted className="text-lg">
            Welcome to the Deltares data management suite. Soon you will be able
            to find and publish datasets.
          </Muted>
        </div>
      </div>
    </div>
  )
}

export function HomePage() {
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
              <strong className="font-medium">FAIR Methods</strong>
              <Muted>
                Guides on how to ensure FAIR data and workflows for your
                projects.
              </Muted>
            </div>
            <div className="flex-shrink-0">
              <Badge variant="secondary" className="uppercase flex-shrink-0">
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
