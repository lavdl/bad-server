import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import BadRequestError from '../errors/bad-request-error'
import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new BadRequestError('Файл не загружен'))
  }

  if (req.file.size < 2048) {
    return next(new BadRequestError('Файл слишком маленький'))
  }

  try {
    const uploadedPath = req.file.path
      ? req.file.path
      : path.join(req.file.destination, req.file.filename)

    const fileBuffer = await fs.readFile(uploadedPath)

    let metadata
    try {
      metadata = await sharp(fileBuffer).metadata()
    } catch {
      return next(new BadRequestError('Некорректное изображение'))
    }

    if (!metadata.width || !metadata.height) {
      return next(new BadRequestError('Некорректное изображение'))
    }

    const fileName = process.env.UPLOAD_PATH
      ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
      : `/${req.file.filename}`

    return res.status(constants.HTTP_STATUS_CREATED).send({
      fileName,
      originalName: req.file.originalname,
    })
  } catch (error) {
    if (error && typeof error === 'object' && (error as any).code === 'LIMIT_FILE_SIZE') {
      return next(new BadRequestError('Файл слишком большой'))
    }
    return next(error)
  }
}

export default {}
