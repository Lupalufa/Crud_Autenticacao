const express = require("express")
const AlunoController = require("../controllers/aluno.controller")
// const AutenticacaoController = require("../../autenticacao/controller/autenticacao.controller")
const AutenticacaoMiddleware = require("../middleware/aluno.middleware")

const router = express.Router()


// perfil

router.post('/cadastrar', AlunoController.cadastrar)

router.get('/perfil', AutenticacaoMiddleware.autenticarToken, AlunoController.perfil)

module.exports = router