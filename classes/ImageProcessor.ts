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
    isRotated!: boolean
    imageSideOrder!: Array<Measures>

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
                                 },
                                 orientation = 1,
                                 isContain = true
                             }: ImageTransformArguments) {
        // const canvasAspectRatio = canvas.width / canvas.height
        // const imageAspectRatio = imageMeasures.width / imageMeasures.height
        const centerHeight = (imageMeasures.height - canvas[this.isRotated ? Measures.width : Measures.height]) / 2
        const centerWidth = (imageMeasures.width - canvas[this.isRotated ? Measures.height : Measures.width]) / 2
        // const centerHeightRotated = imageAspectRatio > 1 || canvasAspectRatio > imageAspectRatio
        //   ? -centerWidth
        //   : centerWidth

        switch (orientation) {
            // case 3:
            //   // | x |   |
            //   // |   | o |
            //   return {
            //     degreesToRotate: 180,
            //     translateX: isContain ? imageMeasures[this.imageSideOrder[0]] : canvas.width + centerWidth,
            //     translateY: isContain ? imageMeasures[this.imageSideOrder[1]] : canvas.height + centerHeight
            //   }
            // case 6:
            //   // |   | x |
            //   // |   | o |
            //   return {
            //     degreesToRotate: 270,
            //     translateX: isContain ? 0 : -centerHeight,
            //     translateY: isContain ? imageMeasures[this.imageSideOrder[1]] : canvas.height - centerHeightRotated
            //   }
            // case 8:
            //   // |   |   |
            //   // | x | o |
            //   return {
            //     degreesToRotate: 90,
            //     translateX: isContain ? imageMeasures[this.imageSideOrder[0]] : canvas.width + centerHeight,
            //     translateY: isContain ? 0 : centerHeightRotated
            //   }
            default:
                return {
                    degreesToRotate: 0,
                    translateX: isContain ? 0 : -centerWidth,
                    translateY: isContain ? 0 : -centerHeight
                }
        }
    }

    getAspectRatioRelationship (canvas: MeasuresObject, image: MeasuresObject) {
        const canvasAspectRatio = canvas.width / canvas.height
        const imageAspectRatio = image[this.imageSideOrder[0]] / image[this.imageSideOrder[1]]
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

        const canvasLeadingSide = isContain === isCanvasMoreLandscapeThanImage ? Measures.height : Measures.width
        const imageLeadingSide = isContain === isCanvasMoreLandscapeThanImage ? this.imageSideOrder[1] : this.imageSideOrder[0]
        const isReducing = canvas[canvasLeadingSide] < image[imageLeadingSide]
        const resizeRatio = canvas[canvasLeadingSide] / image[imageLeadingSide]

        if (isReducing) {
            return {
                [this.imageSideOrder[0]]: isContain === isCanvasMoreLandscapeThanImage
                    ? image[this.imageSideOrder[0]] * resizeRatio
                    : canvas.width,
                [this.imageSideOrder[1]]: isContain === isCanvasMoreLandscapeThanImage
                    ? canvas.height
                    : image[this.imageSideOrder[1]] * resizeRatio
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
                const orientation = this.getImageOrientation(imageBuffer, mimeType)
                this.isRotated = orientation === 6 || orientation === 8 || orientation === 1 || orientation === 3
                this.imageSideOrder = this.isRotated
                    ? [Measures.width, Measures.height]
                    : [Measures.height, Measures.width]
                const measures = this.getImageResizeValues({
                    canvas: this.canvas,
                    image: imageTag,
                    isContain
                })

                const {
                    degreesToRotate,
                    translateX,
                    translateY
                } = this.getImageTransformValues({ canvas: this.canvas, orientation, imageMeasures: measures, isContain })

                if (isContain) {
                    this.setupCanvas(measures[this.imageSideOrder[0]], measures[this.imageSideOrder[1]])
                }

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
