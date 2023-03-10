const conexao = require("../conexao");
const bcrypt = require("bcrypt");

const cadastrarUsuario = async (req, res) => {
	const {nome, email, senha, nome_loja} = req.body;

	if (!nome) {
		return res.status(404).json("O campo nome é obrigatório");
	}

	if (!email) {
		return res.status(404).json("O campo email é obrigatório");
	}

	if (!senha) {
		return res.status(404).json("O campo senha é obrigatório");
	}

	if (!nome_loja) {
		return res.status(404).json("O campo nome_loja é obrigatório");
	}

	try {
		const quantidadeUsuarios = await conexao
			.knex("usuarios")
			.where({email})
			.select("id")
			.first();

		if (quantidadeUsuarios) {
			return res.status(400).json("O email já existe");
		}

		const senhaCriptografada = await bcrypt.hash(senha, 10);

		const usuario = await conexao
			.knex("usuarios")
			.returning(["nome", "email", "nome_loja"])
			.insert({nome, email, senha: senhaCriptografada, nome_loja})
			.then((users) => users[0]);

		if (!usuario) {
			return res.status(400).json("O usuário não foi cadastrado.");
		}

		return res.status(200).json(usuario);
	} catch (error) {
		return res.status(400).json(error.message);
	}
};

const obterPerfil = async (req, res) => {
	return res.status(200).json(req.usuario);
};

const atualizarPerfil = async (req, res) => {
	const {nome, email, senha, nome_loja} = req.body;
	const usuarioId = req.usuario.id;

	if (!nome && !email && !senha && !nome_loja) {
		return res
			.status(404)
			.json("É obrigatório informar ao menos um campo para atualização");
	}

	try {
		if (email) {
			if (email !== req.usuario.email) {
				const quantidadeUsuarios = await conexao
					.knex("usuarios")
					.where({email})
					.first();

				if (quantidadeUsuarios) {
					return res.status(400).json("O email já existe");
				}
			}
		}

		const senhaCriptografada = await bcrypt.hash(senha, 10);

		const usuarioAtualizado = await conexao
			.knex("usuarios")
			.update({nome, email, senha: senhaCriptografada, nome_loja})
			.where({id: usuarioId})
			.returning("id");

		if (!usuarioAtualizado) {
			return res.status(400).json("O usuario não foi atualizado");
		}

		return res.status(200).json("Usuario foi atualizado com sucesso.");
	} catch (error) {
		return res.status(400).json(error.message);
	}
};

module.exports = {
	cadastrarUsuario,
	obterPerfil,
	atualizarPerfil,
};
