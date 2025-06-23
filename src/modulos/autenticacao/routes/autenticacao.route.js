const express = require('express')

const router = express.Router()

const {login, refresToken, logout } = require("../controller/autenticacao.controller")

router.post('/login', login)

router.post('/logout', logout)

router.post('/refress-token', refresToken)

module.exports = router