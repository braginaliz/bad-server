import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import BadRequestError from '../errors/bad-request-error'
import sharp from 'sharp'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const MIN_SIZE = 2 * 1024
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }
    try {
        if (req.file.size < MIN_SIZE) {
            return next(new BadRequestError('Файл слишком маленький (менее 2KB)'))
        }

        try {
            await sharp(req.file.path).metadata()
        } catch {
            return next(new BadRequestError('Файл не является валидным изображением'))
        }
        
        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file?.filename}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            // originalName: req.file?.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}