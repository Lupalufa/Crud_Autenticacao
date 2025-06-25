const express = require("express")
const AlunoController = require("../controllers/aluno.controller")

const router = express.Router()


// perfil

router.post('/cadastrar', AlunoController.cadastrar)

module.exports = router