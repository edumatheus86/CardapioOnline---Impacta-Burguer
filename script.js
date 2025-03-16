

//Máscara para o campo de telefone
// Seleciona o input de telefone
const telefoneInput = document.getElementById('telefone');

telefoneInput.addEventListener('input', (e) => {
    let raw = e.target.value.replace(/\D/g, '');
    raw = raw.substring(0, 11);

    let formatted = '';

    if (raw.length > 0) {
        formatted = '(' + raw.substring(0, Math.min(2, raw.length));
    }

    if (raw.length >= 2) {
        formatted += ') ';
        if (raw.length <= 7) {
            formatted += raw.substring(2);
        } else {
            formatted += raw.substring(2, 7) + '-' + raw.substring(7);
        }
    }

    // Atualiza o valor do input com a máscara aplicada
    e.target.value = formatted;
});



// Abre o modal ao clicar no botão de Cadastro
document.getElementById('cadastroBtn').addEventListener('click', function () {
    document.getElementById('cadastroModal').classList.remove('hidden');
});

// Fecha o modal ao clicar no botão de Cancelar
document.getElementById('closeModal').addEventListener('click', function () {
    document.getElementById('cadastroModal').classList.add('hidden');
});

// Captura o formulário de cadastro
const formCadastro = document.getElementById('formCadastro');

formCadastro.addEventListener('submit', function (event) {
    event.preventDefault(); // Evita recarregar a página

    // Pega os valores dos campos
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const endereco = document.getElementById('endereco').value;

    // Monta o objeto com os dados
    const dados = { nome, telefone, email, endereco };

    // Envia os dados para o servidor (rota /cadastro)
    fetch('http://localhost:3000/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Resposta do servidor:', data);
            alert('Usuário cadastrado com sucesso!');
            document.getElementById('cadastroModal').classList.add('hidden');
            formCadastro.reset();
        })
        .catch(error => {
            console.error('Erro ao cadastrar:', error);
            alert('Ocorreu um erro ao cadastrar o usuário.');
        });
});