let appPrefix = `/app`

export let routes = {
  items() {
    return `${appPrefix}/items`
  },
  createItem() {
    return `${appPrefix}/items/create`
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
  createCollection() {
    return `${appPrefix}/collections/create`
  },

  catalogs() {
    return `${appPrefix}/catalogs`
  },
  createCatalog() {
    return `${appPrefix}/catalogs/create`
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
  createGroup() {
    return `${appPrefix}/groups/create`
  },

  // Authentication
  login() {
    return `/auth/microsoft`
  },
}