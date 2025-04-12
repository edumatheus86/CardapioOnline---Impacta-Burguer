const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const adressInput = document.getElementById("adress")
const adressWarning = document.getElementById("adress-warn")

let cart = [] // Array para armazenar os itens do carrinho

//abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex"

})

//fechar o modal do carrinho quando clicar fora
cartModal.addEventListener("click", function (event) {
    if (e.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        //Adicionar ao carrinho
        addToCart(name, price)
    }

})

//Função para adicionar um item ao carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name) // Verifica se o item já existe no carrinho

    if (existingItem) {
        existingItem.quantity += 1 // Se já existe, aumenta a quantidade
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        }) // Adiciona o item ao carrinho

    }

    updateCartModal()
}

//Atualiza o carrinho na interface
function updateCartModal() {
    cartItemsContainer.innerHTML = ""; // Limpa o conteúdo atual do carrinho
    let total = 0; // Variável para armazenar o total do carrinho

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class = "flex justify-between items-center">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                    <button>
                        Remover
                    </button>
                
            </div>
        `

        total += item.price * item.quantity; // Atualiza o total com o preço do item multiplicado pela quantidade

        cartItemsContainer.appendChild(cartItemElement) // Adiciona o item ao carrinho na interface
    })
 
    cartTotal.textContent = `R$ ${total.toFixed(2)}` // Atualiza o total na interface
    cartCounter.innerHTML = cart.length // Atualiza o contador de itens no carrinho

}

document.addEventListener('DOMContentLoaded', () => {



    atualizarInterfaceLogado();

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

    // Seleciona os botões e modais
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const cadastroBtn = document.getElementById('cadastroBtn');
    const cadastroModal = document.getElementById('cadastroModal');
    const closeModal = document.getElementById('closeModal');

    // Evento para abrir o modal de Login
    loginBtn.addEventListener('click', () => {
        loginModal.classList.remove('hidden');
    });

    // Fecha o modal de Login ao clicar no botão "Cancelar"
    closeLoginModal.addEventListener('click', () => {
        loginModal.classList.add('hidden');
    });

    // Fecha o modal de Login ao clicar fora dele
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.add('hidden');
        }
    });

    // Abre o modal de Cadastro
    cadastroBtn.addEventListener('click', () => {
        cadastroModal.classList.remove('hidden');
    });

    // Fecha o modal de Cadastro
    closeModal.addEventListener('click', () => {
        cadastroModal.classList.add('hidden');
    });

    // Captura o formulário de cadastro e envia os dados
    const formCadastro = document.getElementById('formCadastro');
    formCadastro.addEventListener('submit', (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const endereco = document.getElementById('endereco').value;

        const dados = { nome, telefone, email, senha, endereco };

        fetch('http://localhost:3000/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Resposta do servidor:', data);
                alert('Usuário cadastrado com sucesso!');
                cadastroModal.classList.add('hidden');
                formCadastro.reset();
            })
            .catch(error => {
                console.error('Erro ao cadastrar:', error);
                alert('Ocorreu um erro ao cadastrar o usuário.');
            });
    });

    // Captura o formulário de login e envia os dados
    const formLogin = document.getElementById('formLogin');
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('emailLogin').value.trim();
        const senha = document.getElementById('senhaLogin').value.trim();

        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        })
            .then(response => response.json())

            .then(data => {
                console.log('Login data:', data);
                if (data.error) {
                    alert(data.error);
                } else {
                    alert(data.message);
                    console.log('data.user é:', data.user);
                    loginModal.classList.add('hidden');
                    localStorage.setItem('user', JSON.stringify(data.user));
                    atualizarInterfaceLogado();
                }
            })
            .catch(error => {
                console.error('Erro no login:', error);
                alert('Usuário ou senha incorreto.');
            });
    });

    // Evento de logout
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        atualizarInterfaceLogado();
    });

    // Função para atualizar a interface com base no status de login
    function atualizarInterfaceLogado() {
        const userData = localStorage.getItem('user');
        const loginBtn = document.getElementById('loginBtn');
        const cadastroBtn = document.getElementById('cadastroBtn');
        const userArea = document.getElementById('userArea');
        const userGreeting = document.getElementById('userGreeting');

        if (userData) {
            try {
                const userObj = JSON.parse(userData);
                if (!userObj || !userObj.nome) {
                    throw new Error('Dados de usuário inválidos');
                }
                const primeiroNome = userObj.nome.split(' ')[0];
                userGreeting.textContent = `Olá, ${primeiroNome}`;
                loginBtn.classList.add('hidden');
                cadastroBtn.classList.add('hidden');
                userArea.classList.remove('hidden');
            } catch (err) {
                console.error("Erro ao atualizar interface:", err);
                localStorage.removeItem('user');
                loginBtn.classList.remove('hidden');
                cadastroBtn.classList.remove('hidden');
                userArea.classList.add('hidden');
            }
        } else {
            loginBtn.classList.remove('hidden');
            cadastroBtn.classList.remove('hidden');
            userArea.classList.add('hidden');
        }
    }
});

