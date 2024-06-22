import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import type { FileFilterCallback } from 'multer'

export const IMAGE_OPTIONS: MulterOptions = {
  limits: {
    fieldSize: 5 * 1024 * 1024 // 5mb
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const fileExts = ['png', 'jpg', 'jpeg', 'webp', 'heif', 'heic']
    const ext = file.originalname.split('.').pop().toLocaleLowerCase()
    if (!fileExts.includes(ext)) {
      return cb(null, false)
    }
    cb(null, true)
  }
}
