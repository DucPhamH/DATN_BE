import multer from 'multer'

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads/avatar')
//   },
//   filename: function (req, file, cb) {
//     cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
//   }
// })

const functionStorage = (path: string) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path)
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
  })
}

export const uploadAvatar = multer({
  storage: functionStorage('./src/uploads/avatar'),
  limits: {
    fileSize: 1024 * 1024 * 50
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }
})

export const uploadCoverAvatar = multer({
  storage: functionStorage('./uploads/cover'),
  limits: {
    fileSize: 1024 * 1024 * 50
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }
})
