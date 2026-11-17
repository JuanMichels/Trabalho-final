const fs = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

const diretorioUploads = path.resolve(__dirname, '../../uploads');
const extensoesPermitidas = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp'
};

fs.mkdirSync(diretorioUploads, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, diretorioUploads),
    filename: (_req, file, callback) => {
        callback(null, `${crypto.randomBytes(16).toString('hex')}${extensoesPermitidas[file.mimetype]}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
        fields: 5,
        parts: 6,
        fieldSize: 10 * 1024
    },
    fileFilter: (_req, file, callback) => {
        if (!extensoesPermitidas[file.mimetype]) {
            const error = new Error('Envie uma imagem JPG, PNG ou WEBP.');
            error.code = 'INVALID_IMAGE_TYPE';
            return callback(error);
        }

        return callback(null, true);
    }
});

function uploadImagem(req, res, next) {
    upload.single('imagem')(req, res, (error) => {
        if (!error) {
            return next();
        }

        if (error instanceof multer.MulterError) {
            const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
            return res.status(status).json({
                status: 'error',
                message: error.code === 'LIMIT_FILE_SIZE'
                    ? 'A imagem deve ter no máximo 5 MB.'
                    : 'Não foi possível processar o arquivo enviado.'
            });
        }

        if (error.code === 'INVALID_IMAGE_TYPE') {
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        }

        return next(error);
    });
}

module.exports = uploadImagem;
