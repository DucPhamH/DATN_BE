import multer from 'multer'

const upload = multer({
  // storage: multer.memoryStorage(),
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

export default upload
