const conexao = require('../conexao');
const jwt = require('jsonwebtoken');

const senhaHash = process.env.API_KEY;

const verificaLogin = async (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization) {
		return res.status(401).json('Não autorizado');
	}

	try {
		const token = authorization.replace('Bearer ', '').trim();

		const { id } = jwt.verify(token, senhaHash);

		const resultado = await conexao.knex('usuarios').where({ id }).first();

		if (!resultado) {
			return res.status(404).json('Usuario não encontrado');
		}

		const { senha, ...usuario } = resultado;

		req.usuario = usuario;

		next();
	} catch (error) {
		return res.status(400).json(error.message);
	}
};

module.exports = verificaLogin;
