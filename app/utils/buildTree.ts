type TreeItem<T> = T & { children: TreeItem<T>[] }

export function buildTree<T>(
  array: T[],
  elementKey: keyof T,
  parentKey: keyof T,
): TreeItem<T>[] {
  let tree = [] as TreeItem<T>[]
  for (let i = 0; i < array.length; i++) {
    if (array[i][parentKey]) {
      let parent = array
        .filter(elem => elem[elementKey] === array[i][parentKey])
        .pop() as TreeItem<T>
      if (!parent['children']) {
        parent.children = []
      }
      parent.children.push(array[i] as TreeItem<T>)
    } else {
      tree.push(array[i] as TreeItem<T>)
    }
  }
  return tree
}
