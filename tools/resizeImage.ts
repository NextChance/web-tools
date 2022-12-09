import {MockFile} from "../types/Files";
import ImageProcessor from "../classes/ImageProcessor";
import {processImageResponse} from "../types/Image";

interface resizeConfig {
    originalFile: MockFile
    isContain?: boolean
    limit: number
    width?: number
    height?: number
    reductionRatio?: number
}

const _processImageUntilSizeFits = async ({ originalFile, limit, isContain = true, width = 1280, height = 1280,  reductionRatio = 0.9}: resizeConfig): Promise<processImageResponse> => {
    const imageProcessor = new ImageProcessor(width, height)
    const { formattedImage, file } = await imageProcessor.processFile({
        file: originalFile,
        name: originalFile.name,
        type: originalFile.type,
        isContain
    })
    if (file.blob.size > limit) {
        return await _processImageUntilSizeFits({
            originalFile,
            isContain,
            limit,
            width: Math.ceil(reductionRatio * width),
            height: Math.ceil(reductionRatio * height)
        })
    } else {
        return { formattedImage, file }
    }
}

export default _processImageUntilSizeFits
