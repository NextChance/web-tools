import { ExifParserFactory, OrientationTypes } from 'ts-exif-parser'
import { Measures } from "../types/Image";
import type {
    ImageResizeValuesArguments,
    ImageTransformArguments,
    MeasuresObject,
    ProcessConfig,
    ProcessFileArgs
} from "../types/Image";


export interface processImageResponse {
    formattedImage: string,
    file: {
        blob: Blob,
        name: string,
        type: string
    }
}

export default class ImageProcessor {
    canvas!: HTMLCanvasElement

    constructor (canvasWidth: number, canvasHeight: number) {
        this.setupCanvas(canvasWidth, canvasHeight)
    }

    setupCanvas (canvasWidth = 0, canvasHeight = 0) {
        this.canvas = document.createElement('canvas')
        this.canvas.height = canvasHeight
        this.canvas.width = canvasWidth
    }

    getImageOrientation (imageBuffer: ArrayBuffer | null, mimeType = 'image/jpeg'): OrientationTypes {
        if (imageBuffer && mimeType === 'image/jpeg') {
            const parser = ExifParserFactory.create(imageBuffer)
            const parsedImage = parser.parse()
            return parsedImage && parsedImage.tags && parsedImage.tags.Orientation
                ? parsedImage.tags.Orientation
                : OrientationTypes.TOP_LEFT
        } else {
            return OrientationTypes.TOP_LEFT
        }
    }

    bufferToBase64 (imageBuffer: ArrayBuffer | null, mimeType = 'image/jpeg') {
        if (imageBuffer) {
            const uint8 = new Uint8Array(imageBuffer)
            const string = uint8.reduce((acc, item) => {
                return acc + String.fromCharCode(item)
            }, '')

            return `data:${mimeType};base64,${btoa(string)}`
        } else {
            return ''
        }
    }

    getImageTransformValues ({
                                 canvas = {
                                     height: 1,
                                     width: 1
                                 },
                                 imageMeasures = {
                                     height: 1,
                                     width: 1
                                 }
                             }: ImageTransformArguments) {
        const centerHeight = (imageMeasures.height - canvas[Measures.height]) / 2
        const centerWidth = (imageMeasures.width - canvas[Measures.width]) / 2
        return {
            degreesToRotate: 0,
            translateX: -centerWidth,
            translateY: -centerHeight
        }
    }

    getAspectRatioRelationship (canvas: MeasuresObject, image: MeasuresObject) {
        const canvasAspectRatio = canvas.width / canvas.height
        const imageAspectRatio = image[Measures.width] / image[Measures.height]

        return canvasAspectRatio > imageAspectRatio
    }

    getImageResizeValues ({
                              canvas = {
                                  height: 1,
                                  width: 1
                              },
                              image = {
                                  height: 1,
                                  width: 1
                              },
                              isContain = false
                          }: ImageResizeValuesArguments): MeasuresObject {
        const isCanvasMoreLandscapeThanImage = this.getAspectRatioRelationship(canvas, image)
        const leadingSize = isContain === isCanvasMoreLandscapeThanImage ? Measures.height : Measures.width
        const isReducing = canvas[leadingSize] < image[leadingSize]
        const resizeRatio = canvas[leadingSize] / image[leadingSize]

        if (isReducing) {
            return {
                [Measures.height]: image[Measures.height] * resizeRatio,
                [Measures.width]: image[Measures.width] * resizeRatio
            } as MeasuresObject
        } else {
            return {
                [Measures.height]: image.height,
                [Measures.width]: image.width
            }
        }
    }

    processImage (config: ProcessConfig, isContain: boolean): Promise<processImageResponse> {
        const {
            imageBuffer = null,
            fileName = 'image.jpg',
            mimeType = 'image/jpeg'
        } = config

        const imageSrc = config.imageSrc || this.bufferToBase64(imageBuffer, mimeType)

        const imageTag = document.createElement('img')
        return new Promise((resolve, reject) => {
            imageTag.onload = () => {
                const measures = this.getImageResizeValues({
                    canvas: this.canvas,
                    image: imageTag,
                    isContain
                })

                const {
                    degreesToRotate,
                    translateX,
                    translateY
                } = this.getImageTransformValues({ canvas: this.canvas, imageMeasures: measures })

                const ctx = this.canvas.getContext('2d')
                ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)
                ctx?.save()
                ctx?.translate(translateX, translateY)

                ctx?.rotate(degreesToRotate * Math.PI / 180)
                ctx?.drawImage(imageTag, 0, 0, measures.width, measures.height)
                ctx?.restore()

                ctx?.canvas.toBlob((blob) => {
                    const formattedImage = ctx.canvas.toDataURL(mimeType, 1.0)
                    if (blob) {
                        resolve({
                            formattedImage,
                            file: { blob, name: fileName, type: mimeType }
                        })
                    } else {
                        reject(new Error('Failed on blob conversion'))
                    }
                }, mimeType)
            }
            imageTag.src = imageSrc
        })
    }

    processFile ({
                     file,
                     name,
                     type,
                     isContain,
                     src
                 }: ProcessFileArgs): Promise<processImageResponse> {
        const fileBufferReader = new FileReader()
        return new Promise((resolve) => {
            fileBufferReader.onload = (fileReaderEvent: ProgressEvent<FileReader>) => {
                const result = fileReaderEvent?.target?.result as ArrayBuffer

                this.processImage({
                        imageBuffer: result,
                        imageSrc: src || '',
                        fileName: name,
                        mimeType: type
                    },
                    isContain
                ).then(resolve)
            }
            fileBufferReader.readAsArrayBuffer(file)
        })
    }
}
