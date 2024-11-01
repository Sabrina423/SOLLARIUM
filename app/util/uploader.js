const multer = require("multer");
const path = require("path");

const filefilter = (req, file, callBlack) => {
    const allowedExtensions = /jpeg|jpg|png|gif/
    const extname = allowedExtensions.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedExtensions.test(file.mimetype);

    if (extname && mimetype) {
        return callBlack(null, true);
    } else {
        callBlack(new Error("Apenas arquivios de imagem são permitidos"));
    }
};

module.exports = (caminho = null, tamanhoArq = 3) => {
    if (caminho == null) {
        // Versão com armazenamento em SGBD
        const storage = multer.memoryStorage();
        upload = multer({
            storage: storage,
            limits: { fileSize: tamanhoArq * 1024 * 1024 },
            fileFilter: fileFilter,
        });
    } else {
        //Versão com armazenamento em diretório
        // Definindo o diretório de armazenamento das imagens
        var storagePasta = multer.diskStorage({
            destination: (req, file, callBlack) => {
                callBlack(null, caminho); // diretório de destino
            },
            filename: (req, file, callBlack) => {
                //renomeando o arquivo para evitar duplicidade de nomes
                callBlack(
                    null,
                    file.fieldname + "-" + Date.now() + path.extname(file.originalname)
                );
            },
        });
        upload = multer({
            storage: storagePasta,
            limits: { fileSize: tamanhoArq * 1024 * 1024 },
            fileFilter: filefilter,
        });
    }
    return (campoArquivo) => {
        return (req, res, next) => {
            req.session.erroMulter = null;
            upload.single(campoArquivo)(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    req.session.erroMulter = {
                        value: '',
                        msg: err.message,
                        path: campoArquivo
                    }
                } else if (err) {
                    req.session.erroMulter = {
                        value: '',
                        msg: err.message,
                        path: campoArquivo
                    }

                }
                next();
            });
        };
    }

};