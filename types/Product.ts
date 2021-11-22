export interface Product {
  id: string
  name: string
  description: string
  merchantName: string
  brand: string
  discountPercentage: number
  fullPrice: string
  savedMoney: string
  salePrice: string
  url: string
  images: Array<ProductImgUI>
  cacheExpires: number
}

export interface ProductImgUI {
  url: string
  alt: string
  src: string
  srcSets: string
}
