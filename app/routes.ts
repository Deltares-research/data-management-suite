let appPrefix = `/app`

export let routes = {
  items() {
    return `${appPrefix}/items`
  },
  createItem() {
    return `${appPrefix}/items/create`
  },

  // Auth
  login() {
    return `/auth/microsoft`
  },
}
