const express = require('express')
const AutenticacaoController = require('../controller/autenticacao.controller')

const router = express.Router()

const {login, refreshToken, sair } = require("../controller/autenticacao.controller")

router.post('/login', AutenticacaoController.login)

router.post('/logout', AutenticacaoController.sair)

router.post('/refress-token', AutenticacaoController.refreshToken)

module.exports = router