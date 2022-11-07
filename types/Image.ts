import { OrientationTypes } from 'ts-exif-parser'
import type { MockFile } from "./Files";

export default interface Image {
  src: string
  srcset?: string
  alt?: string
}

export interface DiscoveryImage {
  url: string
  title: string
  original_url: string
}

export enum Measures {
  height = 'height',
  width = 'width',
}

export type MeasuresObject = {
  [key in Measures]: number
}

export interface processImageResponse {
  formattedImage: string,
  file: {
    blob: Blob,
    name: string,
    type: string
  }
}

export interface ProcessConfig {
  imageBuffer: ArrayBuffer | null,
  fileName: string,
  mimeType: string,
  imageSrc: string
}

export interface ProcessFileArgs {
  file: MockFile,
  name: string,
  type: string,
  isContain: boolean,
  src?: string
}

export interface ImageTransformArguments {
  canvas: MeasuresObject,
  imageMeasures: MeasuresObject,
  orientation: OrientationTypes,
  isContain: boolean
}

export interface ImageResizeValuesArguments {
  canvas: MeasuresObject,
  image: MeasuresObject,
  isContain: boolean
}
