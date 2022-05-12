export const getMetaTags = ({
  description = undefined,
  title = undefined,
  image = undefined
}: {
  description: string | undefined,
  title: string | undefined,
  image?: string | undefined
}) => {
  return [
    {
      hid: 'description',
      name: 'description',
      content: description
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: title
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: description
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: image
    }
  ]
}
