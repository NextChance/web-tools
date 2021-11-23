export default interface Profile {
  imageSet: ProfileImgUI
  name: string
  url: string
  alt: string
  instagram_handler: string
}

export interface ProfileImgUI {
  url: string
  srcSet: string
  smallest: string
}
