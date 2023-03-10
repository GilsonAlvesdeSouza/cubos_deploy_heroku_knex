require('dotenv').config();

const express = require('express');

const rotas = require('./routes');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(rotas);

app.listen(PORT, () => {
	console.log(
		`server is running on port ${PORT}\nhttp://localhost:${PORT}\nto exit press ctrl + c`
	);
});
