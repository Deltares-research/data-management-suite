import type { LoaderFunctionArgs } from '@remix-run/node'

let appPrefix = `/app`

export let routes = {
  home() {
    return `/`
  },
  search() {
    return `/search`
  },
  settings() {
    return `${appPrefix}/settings`
  },
  docs() {
    return `/docs/api`
  },
  storageFinder() {
    return `/storage-finder`
  },

  pythonDocs() {
    return `/docs/`
  },
  items() {
    return `${appPrefix}/items`
  },
  createItem() {
    return `${appPrefix}/items/create`
  },
  // TODO: Narrow down type options
  createItemType(type: string) {
    return `${appPrefix}/items/create/${type}`
  },
  editItem(itemId: string) {
    return `${appPrefix}/items/${itemId}/edit`
  },

  collections() {
    return `${appPrefix}/collections`
  },
  editCollection(collectionId: string) {
    return `${appPrefix}/collections/${collectionId}/edit`
  },
  createCollection(query?: { redirectUrl: string }) {
    return `${appPrefix}/collections/create?${new URLSearchParams(
      query,
    ).toString()}`
  },

  catalogs() {
    return `${appPrefix}/catalogs`
  },
  createCatalog(query?: { redirectUrl: string }) {
    return `${appPrefix}/catalogs/create?${new URLSearchParams(
      query,
    ).toString()}`
  },
  editCatalog(catalogId: string) {
    return `${appPrefix}/catalogs/${catalogId}/edit`
  },

  externalCatalogs() {
    return `${appPrefix}/external-catalogs`
  },
  createExternalCatalog() {
    return `${appPrefix}/external-catalogs/create`
  },

  // Keywords
  keywords() {
    return `${appPrefix}/keywords`
  },

  // Authorization
  groups() {
    return `${appPrefix}/groups`
  },
  group(id: string) {
    return `${appPrefix}/groups/${id}`
  },
  createGroup(query?: { redirectUrl: string }) {
    return `${appPrefix}/groups/create?${new URLSearchParams(query).toString()}`
  },

  // Authentication
  login() {
    return `/auth/microsoft`
  },
}

export function stacRoutes(request: Request) {
  let host = getHost(request)

  return {
    stacAPIRoot() {
      return `${host}/stac`
    },
    stacItem(itemId: string) {
      return `${host}/stac/items/${itemId}`
    },
    stacCollection(collectionId: string) {
      return `${host}/stac/collections/${collectionId}`
    },
    stacItems({
      collectionId,
      ...queryParams
    }: { collectionId: string } & Record<string, string>) {
      return `${host}/stac/collections/${collectionId}/items?${new URLSearchParams(
        queryParams,
      ).toString()}`
    },
    stacCatalog(catalogId: string) {
      return `${host}/stac/catalogs/${catalogId}`
    },
    stacCollections({
      catalogId,
      ...queryParams
    }: { catalogId: string } & Record<string, string>) {
      return `${host}/stac/catalogs/${catalogId}/collections?${new URLSearchParams(
        queryParams,
      ).toString()}`
    },
    stacSearch() {
      return `${host}/stac/search`
    },
    stacQueryables() {
      return `${host}/stac/queryables`
    },
  }
}

export function getHost(request: LoaderFunctionArgs['request']) {
  let url = new URL(request.url)

  return `${url.hostname === 'localhost' ? 'http' : 'https'}://${url.host}`
}
