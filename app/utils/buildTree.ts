type TreeItem<T> = T & { children: TreeItem<T>[]; parent: T }

export function buildTree<T>(
  array: T[],
  elementKey: keyof T,
  parentKey: keyof T,
): TreeItem<T>[] {
  let arrayCopy = JSON.parse(JSON.stringify(array)) as T[]

  let tree = [] as TreeItem<T>[]
  for (let i = 0; i < arrayCopy.length; i++) {
    let item = arrayCopy[i] as TreeItem<T>
    if (item[parentKey]) {
      let parent = (arrayCopy.filter(
        elem => elem[elementKey] === item[parentKey],
      )[0] as TreeItem<T>) ?? { children: [] }

      if (!parent['children']) {
        parent.children = []
      }

      parent.children.push(item)
    } else {
      tree.push(item)
    }
  }
  return tree
}
