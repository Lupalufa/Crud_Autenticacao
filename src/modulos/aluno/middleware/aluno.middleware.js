const jwt = require('jsonwebtoken')

class AutenticacaoMiddleware {
    static autenticarToken(req,res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]

        if (!token){
            return res.status(401).json({msg: "Token de acesso não fornecido"})
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, usuario) => {
            if (err) {
                return res.status(403).json({ msg: "Você não tem autorização para acessar esse campo" })
            }

            req.usuario = usuario
            next()
        })
    }
}

module.exports = AutenticacaoMiddleware