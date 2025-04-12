const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conectando ao MongoDB (para uma instalação local use 'mongodb://localhost:27017/impacta_burger')
// Se estiver usando o Atlas, substitua a URL pela sua string de conexão.
mongoose.connect('mongodb://localhost:27017/impacta_burger', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conectado ao MongoDB com sucesso!'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Criando o esquema do usuário (modelo)
const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    telefone: String,
    email: { type: String, required: true },
    senha: { type: String, required: true },
    endereco: String

});

// Criando o modelo com base no esquema
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Rota para cadastrar usuário
app.post('/cadastro', async (req, res) => {
    const { nome, telefone, email, senha, endereco } = req.body;
    try {
        const novoUsuario = new Usuario({ nome, telefone, email, senha, endereco });
        await novoUsuario.save();
        res.status(200).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
});

// Iniciando o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        // Procura o usuário pelo email
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }
        // Compara a senha enviada com a armazenada
        if (usuario.senha !== senha) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }
        // Se tudo estiver certo, retorna sucesso
        return res.status(200).json({
            message: 'Login realizado com sucesso!',
            user: {
                nome: usuario.nome, // ou só o primeiro nome
                email: usuario.email
            }
        });
    } catch (error) {
        console.error('Erro durante login:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
});