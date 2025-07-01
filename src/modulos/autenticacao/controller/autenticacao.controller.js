const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();
const Aluno = require('../../aluno/models/aluno.model')

// Definindo variaveis de ambiente para TEMPO_ACESS_TOKEN e TEMPO_REFRESH_TOKEN
const tempo_acess_token = process.env.TEMPO_ACESS_TOKEN;
const tempo_refresh_token = process.env.TEMPO_REFRESH_TOKEN;

class AutenticacaoController{
    // gerando o token
    static gerarTokenAcesso(dadosAluno){
        return jwt.sign(dadosAluno, process.env.SECRET_KEY, {
            expiresIn: tempo_acess_token
        });
    };
    // refress token
    static gerarRefressToken(dadosAluno){
        return jwt.sign(dadosAluno, process.env.SECRET_KEY, {
            expiresIn: tempo_refresh_token
        });
    };
    
    static async login(req, res) {
        try {
            const { matricula, senha } = req.body;
            if(!matricula || !senha){
                return res.status(400).json({msg: 'É necessario informar matricula e senha para login'})
            }
            const usuario = await Aluno.findOne({
                where: {matricula}
            });
            if(!usuario){
                return res.status(401).json({msg: 'Usuario não encontrado!'})
            };
            const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
            if(!senhaCorreta){
                return res.status(400).json({msg: 'E-mail ou senha estão incorretos'})
            }
            const dadosAluno = {
                nome: usuario.nome,
                matricula: usuario.matricula,
                papel: 'aluno'
            }
            // Gerando tokens
            const tokenAcesso = AutenticacaoController.gerarTokenAcesso(dadosAluno)
            const refrestoken = AutenticacaoController.gerarRefressToken(dadosAluno)
            
            res.cookie("refreshtoken", refrestoken, {
                httpOnly: false,
                secure: process.env.NODE_ENV,
                sameStrict: 'strict',
                maxAge: 1 * 24
            })

            res.status(200).json({
                tokenAcesso,
                nome: usuario.nome,
                matricula: usuario.matricula,
                // posso transformar em um array com varias opções
                papel: 'aluno'
            })

        } catch (error) {
            
        }
      }

      static refreshToken(req, res){
        const { refreshToken } = req.cookies
        if(!refreshToken) {
            return res.status(403).json({ msg: "Refresh token invalido!"})
        }
        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET,
            (erro, usuario) => {
                if(erro) {
                    return res.status(403).json({msg: "Refresh Token Invalido!" })
                }
                const dadosAluno = {
                    nome: usuario.nome,
                    papel: 'aluno'
                }
                const novoTokenAcesso = this.gerarRefressToken(dadosAluno)
                res.status(200).json({ tokenAcesso: novoTokenAcesso })
            }
        )
    }

      static async sair(req, res) {
        try {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === "development",
                sameSite: "strict"
            })
            res.status(200).json({msg: "Logout realizado com sucesso"})
        } catch (error) {
            res.status(500).json({msg: 'Erro interno do servidor', erro: error.message})
        }
      }
}

module.exports = AutenticacaoController