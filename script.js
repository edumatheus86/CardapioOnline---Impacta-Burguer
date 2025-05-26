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

                    <button class="remove-from-cart-btn" data-name="${item.name}">
                        Remover
                    </button>
                
            </div>
        `

        total += item.price * item.quantity; // Atualiza o total com o preço do item multiplicado pela quantidade

        cartItemsContainer.appendChild(cartItemElement) // Adiciona o item ao carrinho na interface
    })

    cartTotal.textContent = `R$ ${total.toFixed(2)}` // Atualiza o total na interface
    cartCounter.innerHTML = cart.length; // Atualiza o contador de itens no carrinho

}

//Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name") // Pega o nome do item a ser removido

        removeItemCart(name); /// Chama a função para remover o item
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name); // Encontra o índice do item a ser removido

    if (index !== -1) {
        const item = cart[index]; // Pega o item a ser removido

        if (item.quantity > 1) {
            item.quantity -= 1; // Se a quantidade for maior que 1, diminui a quantidade
            updateCartModal(); // Atualiza o carrinho na interface
            return;
        }

        cart.splice(index, 1); // Se a quantidade for 1, remove o item do carrinho
        updateCartModal(); // Atualiza o carrinho na interface
    }

}

adressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value.trim(); // Pega o valor do input e remove espaços em branco

    if (inputValue !== "") {
        adressInput.classList.remove("border-red-500") // Remove a classe de borda vermelha se o valor não estiver vazio
        adressWarning.classList.add("hidden") // Esconde o aviso se o valor não estiver vazio
    }
})

checkoutBtn.addEventListener("click", function () {
    const isOpen = checkRestauranteOpen(); // Verifica se o restaurante está aberto
    if (!isOpen) {
        Toastify({
            text: "Ops, o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },

        }).showToast(); // Exibe um aviso se o restaurante estiver fechado
        return;
    }


    if (cart.length === 0) return;

    if (adressInput.value.trim() === "") {
        adressWarning.classList.remove("hidden") // Mostra o aviso se o endereço estiver vazio
        adressInput.classList.add("border-red-500") // Adiciona a classe de borda vermelha
        return;
    }

    //Enviar o pedido para a api WhatsApp

    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |` // Mapeia os itens do carrinho para o formato desejado
        )
    }).join("\n") // Junta os itens em uma string separada por quebras de linha

    const message = encodeURIComponent(cartItems) // Codifica a mensagem para ser enviada via WhatsApp
    const phone = "11947896699" // Número de telefone para onde a mensagem será enviada

    window.open(`https://wa.me/${phone}?text=${message} Endereço:${adressInput.value}`, "_blank") // Abre o WhatsApp com a mensagem pré-preenchida

    cart.length = 0; // Limpa o carrinho após o envio do pedido
    updateCartModal(); // Atualiza o carrinho na interface


})

// Função para verificar se o restaurante está aberto
function checkRestauranteOpen() {
    const data = new Date();
    const horaAtual = data.getHours();
    return horaAtual >= 18 && horaAtual < 22; // Verifica se a hora atual está entre 18h e 22h
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestauranteOpen(); // Chama a função para verificar se o restaurante está aberto

if (isOpen) {
    spanItem.classList.remove("bg-red-500") // Se o restaurante estiver aberto, remove a classe de oculto
    spanItem.classList.add("bg-green-600") // Adiciona a classe de aberto
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500") // Se o restaurante estiver fechado, adiciona a classe de fechado
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

