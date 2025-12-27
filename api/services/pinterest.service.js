export async function searchPinterest(query) {
  return [
    `https://source.unsplash.com/600x600/?${query}1`,
    `https://source.unsplash.com/600x600/?${query}2`,
    `https://source.unsplash.com/600x600/?${query}3`,
    `https://source.unsplash.com/600x600/?${query}4`,
    `https://source.unsplash.com/600x600/?${query}5`
  ]
}
