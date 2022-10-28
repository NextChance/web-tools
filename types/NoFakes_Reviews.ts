export interface _ImageSlim {
  url: string
}

export interface User {
  id?: string
  name: string
  image: _ImageSlim
  totalReviews?: number
}

export interface ReviewReply {
  text: string,
  repliedAt: number
}
