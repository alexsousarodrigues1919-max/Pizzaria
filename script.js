// Dados das pizzas
const pizzas = [
    {
        id: 1,
        name: "Margherita",
        description: "Molho de tomate, mussarela, manjericão fresco e azeite de oliva",
        price: 45.90,
        category: "tradicional",
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        ingredients: ["Molho de tomate", "Mussarela", "Manjericão", "Azeite"],
        sizes: [
            { name: "Pequena", price: 35.90 },
            { name: "Média", price: 45.90 },
            { name: "Grande", price: 59.90 }
        ]
    },
    {
        id: 2,
        name: "Pepperoni",
        description: "Molho de tomate, mussarela e pepperoni",
        price: 52.90,
        category: "tradicional",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        ingredients: ["Molho de tomate", "Mussarela", "Pepperoni", "Orégano"],
        sizes: [
            { name: "Pequena", price: 42.90 },
            { name: "Média", price: 52.90 },
            { name: "Grande", price: 62.90 }
        ]
    },
    {
        id: 3,
        name: "Quatro Queijos",
        description: "Mussarela, parmesão, provolone e gorgonzola",
        price: 56.90,
        category: "tradicional",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        ingredients: ["Mussarela", "Parmesão", "Provolone", "Gorgonzola", "Orégano"],
        sizes: [
            { name: "Pequena", price: 46.90 },
            { name: "Média", price: 56.90 },
            { name: "Grande", price: 66.90 }
        ]
    },
    {
        id: 4,
        name: "Portuguesa",
        description: "Mussarela, presunto, ovos, cebola, azeitona e orégano",
        price: 58.90,
        category: "especial",
        image: "https://images.unsplash.com/photo-1620374645498-af6bd681a0bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        ingredients: ["Mussarela", "Presunto", "Ovos", "Cebola", "Azeitona", "Orégano"],
        sizes: [
            { name: "Pequena", price: 48.90 },
            { name: "Média", price: 58.90 },
            { name: "Grande", price: 68.90 }
        ]
    },
    {
        id: 5,
        name: "Frango com Catupiry",
        description: "Mussarela, frango desfiado, catupiry e orégano",
        price: 59.90,
        category: "especial",
        image: "https://images.unsplash.com/photo-1594007654726-0a24c5f1e2ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        ingredients: ["Mussarela", "Frango desfiado", "Catupiry", "Orégano"],
        sizes: [
            { name: "Pequena", price: 49.90 },
            { name: "Média", price: 59.90 },
            { name: "Grande", price: 69.90 }
        ]
    },
    {
        id: 6,
        name: "Chocolate com Morango",
        description: "Chocolate ao leite, morangos frescos e leite condensado",
        price: 49.90,
        category: "doce",
        image: "https://images.unsplash.com/photo-1593560704560-aa1fd1d6ffea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        ingredients: ["Chocolate ao leite", "Morangos", "Leite condensado"],
        sizes: [
            { name: "Pequena", price: 39.90 },
            { name: "Média", price: 49.90 },
            { name: "Grande", price: 59.90 }
        ]
    }
];

// Estado do carrinho
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Elementos do DOM
const pizzaGrid = document.getElementById('pizza-grid');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const searchInput = document.getElementById('search-pizza');
const categoryFilter = document.getElementById('filter-category');
const checkoutBtn = document.getElementById('checkout-btn');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartToggle = document.querySelector('.cart-toggle');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCartBtn = document.querySelector('.close-cart');
const loadingScreen = document.getElementById('loading-screen');
const content = document.getElementById('content');
const cartCount = document.querySelector('.cart-count');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const content = document.getElementById('content');
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            content.classList.remove('hidden');
            initApp();
        }, 300);
    }, 1500);
});

// Inicializa o aplicativo
function initApp() {
    // Garante que o carrinho está vazio ao iniciar
    cart = [];
    saveCart();
    
    // Renderiza os filtros de categoria
    renderCategoryFilters();
    
    // Renderiza as pizzas
    renderPizzas();
    
    // Atualiza o carrinho
    updateCart();
    
    // Configura os event listeners
    setupEventListeners();
    
    // Adiciona evento de input para a busca
    if (searchInput) {
        searchInput.addEventListener('input', filterPizzas);
    }
    
    // Adiciona evento de change para o seletor de categoria
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            const category = e.target.value;
            const buttons = document.querySelectorAll('.category-btn');
            buttons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.category === category);
            });
            filterPizzas();
        });
    }
}

// Renderiza as pizzas na grade
function renderPizzas(filteredPizzas = pizzas) {
    pizzaGrid.innerHTML = '';

    if (filteredPizzas.length === 0) {
        pizzaGrid.innerHTML = '<p class="no-results">Nenhuma pizza encontrada.</p>';
        return;
    }

    filteredPizzas.forEach(pizza => {
        const pizzaCard = createPizzaCard(pizza);
        pizzaGrid.appendChild(pizzaCard);
    });
}

// Cria o card da pizza
function createPizzaCard(pizza) {
    const pizzaCard = document.createElement('div');
    pizzaCard.className = 'pizza-card';
    pizzaCard.dataset.id = pizza.id;
    pizzaCard.dataset.category = pizza.category;

    pizzaCard.innerHTML = `
        <img src="${pizza.image}" alt="${pizza.name}" class="pizza-img">
        <div class="pizza-info">
            <div class="pizza-header">
                <h3 class="pizza-title">${pizza.name}</h3>
                <span class="pizza-price">R$ ${pizza.price.toFixed(2)}</span>
            </div>
            <p class="pizza-desc">${pizza.description}</p>
            <div class="pizza-actions">
                <div class="quantity-selector">
                    <button class="quantity-btn minus" data-pizza-id="${pizza.id}">-</button>
                    <span class="quantity">1</span>
                    <button class="quantity-btn plus" data-pizza-id="${pizza.id}">+</button>
                </div>
                <button class="add-to-cart" data-pizza-id="${pizza.id}">
                    <i class="fas fa-cart-plus"></i> Adicionar
                </button>
            </div>
        </div>
    `;

    return pizzaCard;
}

// Funções do carrinho
function addToCart(pizzaId, quantity = 1) {
    const pizza = pizzas.find(p => p.id === pizzaId);
    if (!pizza) return;

    const existingItem = cart.find(item => item.id === pizzaId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: pizza.id,
            name: pizza.name,
            price: pizza.price,
            image: pizza.image,
            quantity: quantity
        });
    }
    
    updateCart();
    saveCart();
    showNotification(`${quantity > 1 ? quantity + 'x ' : ''}${pizza.name} adicionada ao carrinho!`);
    
    // Mostra o carrinho quando um item é adicionado
    if (!cartSidebar.classList.contains('active')) {
        toggleCart();
    }
}

function removeFromCart(pizzaId) {
    const index = cart.findIndex(item => item.id === pizzaId);
    if (index === -1) return;

    const item = cart[index];
    if (item.quantity > 1) {
        item.quantity--;
    } else {
        cart.splice(index, 1);
    }

    updateCart();
    saveCart();
}

function updateCart() {
    renderCartItems();
    updateCartTotal();
    updateCartCount();
    saveCart();
}

function renderCartItems() {
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
                <a href="#cardapio" class="btn btn-secondary" id="ver-cardapio-btn">Ver Cardápio</a>
            </div>
        `;
        
        // Adiciona evento ao botão de ver cardápio
        const verCardapioBtn = document.getElementById('ver-cardapio-btn');
        if (verCardapioBtn) {
            verCardapioBtn.addEventListener('click', () => {
                toggleCart();
                document.querySelector('#cardapio').scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2)} <small>(${item.quantity}x R$ ${item.price.toFixed(2)})</small></p>
                <div class="cart-item-actions">
                    <button class="quantity-btn minus" data-pizza-id="${item.id}" aria-label="Diminuir quantidade">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-pizza-id="${item.id}" aria-label="Aumentar quantidade">+</button>
                    <button class="remove-item" data-pizza-id="${item.id}" aria-label="Remover item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCartTotal() {
    if (!cartTotal) return;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
}

function updateCartCount() {
    const countElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countElements.forEach(el => {
        el.textContent = totalItems;
    });
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Outras funções auxiliares
function toggleCart() {
    if (!cartSidebar || !cartOverlay) return;
    
    cartSidebar.classList.toggle('active');
    
    if (cartSidebar.classList.contains('active')) {
        cartOverlay.style.display = 'block';
        setTimeout(() => {
            cartOverlay.style.opacity = '1';
        }, 10);
    } else {
        cartOverlay.style.opacity = '0';
        setTimeout(() => {
            cartOverlay.style.display = 'none';
        }, 300);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Configura os event listeners
function setupEventListeners() {
    // Filtros
    if (searchInput) {
        searchInput.addEventListener('input', filterPizzas);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            const category = e.target.value;
            const buttons = document.querySelectorAll('.category-btn');
            buttons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.category === category);
            });
            filterPizzas();
        });
    }
    
    // Botão de alternar carrinho
    if (cartToggle) {
        cartToggle.addEventListener('click', toggleCart);
    }
    
    // Fechar carrinho com o botão X
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', toggleCart);
    }
    
    // Fechar carrinho ao clicar no overlay
    if (cartOverlay) {
        cartOverlay.addEventListener('click', toggleCart);
    }
    
    // Botão de finalizar pedido
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                alert('Pedido finalizado com sucesso! Obrigado pela preferência.');
                cart = [];
                updateCart();
                saveCart();
                toggleCart();
            } else {
                alert('Seu carrinho está vazio!');
            }
        });
    }
    
    // Delegation para os botões
    document.addEventListener('click', (e) => {
        // Botão de adicionar ao carrinho
        if (e.target.closest('.add-to-cart')) {
            const button = e.target.closest('.add-to-cart');
            const pizzaId = parseInt(button.dataset.pizzaId);
            const quantityElement = button.closest('.pizza-actions').querySelector('.quantity');
            const quantity = quantityElement ? parseInt(quantityElement.textContent) : 1;
            addToCart(pizzaId, quantity);
            
            // Reseta a quantidade para 1 após adicionar ao carrinho
            if (quantityElement) {
                quantityElement.textContent = '1';
            }
        }
        
        // Botões de quantidade na lista de pizzas
        if (e.target.closest('.pizza-card .quantity-btn')) {
            const button = e.target.closest('.quantity-btn');
            const isPlus = button.classList.contains('plus');
            const isMinus = button.classList.contains('minus');
            const quantityElement = button.parentElement.querySelector('.quantity');
            
            if (quantityElement) {
                let quantity = parseInt(quantityElement.textContent);
                
                if (isPlus) {
                    quantityElement.textContent = quantity + 1;
                } else if (isMinus && quantity > 1) {
                    quantityElement.textContent = quantity - 1;
                }
            }
        }
        
        // Botão de remover item do carrinho
        if (e.target.closest('.remove-item') || e.target.closest('.remove-item i')) {
            const button = e.target.closest('[data-pizza-id]');
            if (button) {
                const pizzaId = parseInt(button.dataset.pizzaId);
                removeFromCart(pizzaId);
            }
        }
        
        // Botão de diminuir quantidade no carrinho
        if (e.target.closest('.cart-item .minus')) {
            const button = e.target.closest('.minus');
            if (button) {
                const pizzaId = parseInt(button.dataset.pizzaId);
                removeFromCart(pizzaId);
            }
        }

        // Botão de aumentar quantidade no carrinho
        if (e.target.closest('.cart-item .plus')) {
            const button = e.target.closest('.plus');
            if (button) {
                const pizzaId = parseInt(button.dataset.pizzaId);
                addToCart(pizzaId, 1);
            }
        }
    });
}

// Filtros de categoria
function getUniqueCategories() {
    const categories = new Set();
    pizzas.forEach(pizza => categories.add(pizza.category));
    return ['todas', ...Array.from(categories).sort()];
}

function renderCategoryFilters() {
    const categories = getUniqueCategories();
    const filterContainer = document.createElement('div');
    filterContainer.className = 'category-filters';
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = `category-btn ${category === 'todas' ? 'active' : ''}`;
        button.textContent = category === 'todas' ? 'Todas' : 
                           category === 'doce' ? 'Doces' : 
                           category === 'especial' ? 'Especiais' : 
                           category === 'tradicional' ? 'Tradicionais' : category;
        button.dataset.category = category;
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            // Add active class to clicked button
            button.classList.add('active');
            // Filter pizzas
            filterPizzas();
        });
        filterContainer.appendChild(button);
    });

    const pizzaGrid = document.querySelector('#pizza-grid');
    if (pizzaGrid && pizzaGrid.parentNode) {
        const existingFilters = pizzaGrid.previousElementSibling;
        if (existingFilters && existingFilters.classList.contains('category-filters')) {
            pizzaGrid.parentNode.replaceChild(filterContainer, existingFilters);
        } else {
            pizzaGrid.parentNode.insertBefore(filterContainer, pizzaGrid);
        }
    }
}

function filterPizzas() {
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const activeCategoryBtn = document.querySelector('.category-btn.active');
    const activeCategory = activeCategoryBtn ? activeCategoryBtn.dataset.category : 'todas';

    const filteredPizzas = pizzas.filter(pizza => {
        // Check search term
        const searchTermMatch = searchTerm === '' || 
                              pizza.name.toLowerCase().includes(searchTerm) ||
                              pizza.ingredients.some(ing => 
                                  ing.toLowerCase().includes(searchTerm)
                              );
        
        // Check category
        const categoryMatch = activeCategory === 'todas' || 
                            pizza.category === activeCategory;
        
        return searchTermMatch && categoryMatch;
    });

    renderPizzas(filteredPizzas);
    
    if (filteredPizzas.length === 0) {
        showNotification('Nenhuma pizza encontrada com os critérios selecionados.');
    }
}

// Fecha o carrinho ao clicar fora
document.addEventListener('click', (e) => {
    if (cartSidebar && !cartSidebar.contains(e.target) && !e.target.closest('.cart-toggle')) {
        cartSidebar.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Fecha o carrinho ao pressionar ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartSidebar && cartSidebar.classList.contains('active')) {
        toggleCart();
    }
});

// Configuração do Chat
function setupChat() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatContainer = document.getElementById('chat-container');
    const chatClose = document.getElementById('chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendMessageBtn = document.getElementById('send-message');

    if (!chatToggle || !chatContainer) return;

    // Toggle do chat
    const toggleChat = () => {
        chatContainer.classList.toggle('active');
        chatToggle.style.display = chatContainer.classList.contains('active') ? 'none' : 'flex';
    };

    // Respostas automáticas do bot
    const botResponses = {
        'oi': 'Olá! Como posso ajudar você hoje? 😊',
        'olá': 'Olá! Tudo bem? Em que posso ajudar? 😊',
        'bom dia': 'Bom dia! Como posso te ajudar hoje? ☀️',
        'boa tarde': 'Boa tarde! Em que posso ajudar? 😊',
        'boa noite': 'Boa noite! Como posso te auxiliar? 🌙',
        'cardápio': 'Aqui está nosso cardápio: https://sua-pizzaria.com/cardapio',
        'horário': 'Funcionamos de terça a domingo, das 18h às 23h.',
        'endereço': 'Estamos localizados na Rua das Pizzas, 123 - Centro',
        'telefone': 'Nosso telefone é (00) 1234-5678',
        'formas de pagamento': 'Aceitamos dinheiro, PIX e cartões de crédito/débito.',
        'tempo de entrega': 'O tempo médio de entrega é de 30 a 45 minutos.',
        'obrigado': 'De nada! Estou à disposição para ajudar no que precisar! 😊',
        'tchau': 'Até mais! Volte sempre! 😊',
        'default': 'Desculpe, não entendi. Poderia reformular a pergunta? Ou entre em contato pelo telefone (00) 1234-5678.'
    };

    // Adiciona uma mensagem ao chat
    const addMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content">${text}</div>
            <div class="message-time">${timeString}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Envia uma mensagem
    const sendMessage = () => {
        const message = userInput.value.trim();
        
        if (message === '') return;
        
        // Adiciona a mensagem do usuário
        addMessage(message, 'user');
        userInput.value = '';
        
        // Processa a mensagem e obtém uma resposta
        setTimeout(() => {
            let response = botResponses['default'];
            
            // Verifica se há uma resposta específica para a mensagem
            const lowerMessage = message.toLowerCase();
            for (const [key, value] of Object.entries(botResponses)) {
                if (lowerMessage.includes(key)) {
                    response = value;
                    break;
                }
            }
            
            // Adiciona a resposta do bot com um pequeno atraso
            setTimeout(() => {
                addMessage(response, 'bot');
            }, 500);
        }, 1000);
    };

    // Event Listeners
    chatToggle.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);
    sendMessageBtn.addEventListener('click', sendMessage);
    
    // Enviar mensagem ao pressionar Enter
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Inicializa o chat quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupChat();
});