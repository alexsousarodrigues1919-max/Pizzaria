// Variáveis globais
let isAuthenticated = false;
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123'; // Em produção, use um sistema de autenticação seguro

// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const loadingScreen = document.getElementById('loading-screen');
const content = document.getElementById('content');

// Função para simular o carregamento
function simulateLoading() {
    // Mostra a tela de carregamento
    loadingScreen.style.display = 'flex';
    content.classList.add('hidden');
    
    // Simula um tempo de carregamento
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        content.classList.remove('hidden');
        
        // Remove a tela de carregamento do DOM após a animação
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
}

// Função para mostrar/ocultar senha
function togglePasswordVisibility() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Altera o ícone
    const icon = togglePassword.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
}

// Função para mostrar notificação
function showNotification(message, type = 'success') {
    // Remove notificações existentes
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    let icon = '';
    switch(type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        case 'info':
            icon = '<i class="fas fa-info-circle"></i>';
            break;
    }
    
    alert.innerHTML = `${icon} ${message}`;
    
    // Insere a notificação após o cabeçalho
    const header = document.querySelector('header');
    if (header) {
        header.insertAdjacentElement('afterend', alert);
    } else {
        document.body.insertAdjacentElement('afterbegin', alert);
    }
    
    // Remove a notificação após 5 segundos
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 5000);
}

// Função para fazer login
function login(username, password) {
    // Simula uma requisição assíncrona
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                isAuthenticated = true;
                localStorage.setItem('isAuthenticated', 'true');
                resolve(true);
            } else {
                isAuthenticated = false;
                localStorage.removeItem('isAuthenticated');
                reject(new Error('Usuário ou senha incorretos.'));
            }
        }, 1000);
    });
}

// Função para fazer logout
function logout() {
    isAuthenticated = false;
    localStorage.removeItem('isAuthenticated');
    window.location.href = 'login.html';
}

// Função para verificar autenticação
function checkAuth() {
    if (window.location.pathname.includes('login.html')) {
        // Se estiver na página de login, não precisa verificar autenticação
        return;
    }
    
    const auth = localStorage.getItem('isAuthenticated');
    if (auth !== 'true') {
        window.location.href = 'login.html';
    }
}

// Função para carregar o dashboard
function loadDashboard() {
    // Verifica se está na página de login
    if (window.location.pathname.includes('login.html')) {
        // Verifica se já está autenticado
        const auth = localStorage.getItem('isAuthenticated');
        if (auth === 'true') {
            window.location.href = 'dashboard.html';
        }
        return;
    }
    
    // Se não estiver na página de login, verifica autenticação
    checkAuth();
    
    // Atualiza a interface do usuário
    updateUI();
    
    // Carrega os dados do dashboard
    loadDashboardData();
}

// Função para atualizar a interface do usuário
function updateUI() {
    // Atualiza o nome do usuário
    const userElement = document.getElementById('user-name');
    if (userElement) {
        userElement.textContent = 'Administrador';
    }
    
    // Adiciona evento de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    // Ativa o menu ativo
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Toggle do menu responsivo
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

// Função para carregar os dados do dashboard
function loadDashboardData() {
    // Dados simulados para o dashboard
    const stats = {
        totalOrders: 128,
        totalRevenue: 12560.75,
        totalCustomers: 84,
        pendingOrders: 8
    };
    
    const recentOrders = [
        { id: '#ORD-001', customer: 'João Silva', date: '24/11/2023', total: 89.90, status: 'completed' },
        { id: '#ORD-002', customer: 'Maria Santos', date: '24/11/2023', total: 75.50, status: 'processing' },
        { id: '#ORD-003', customer: 'Pedro Oliveira', date: '23/11/2023', total: 120.00, status: 'pending' },
        { id: '#ORD-004', customer: 'Ana Costa', date: '23/11/2023', total: 65.80, status: 'completed' },
        { id: '#ORD-005', customer: 'Carlos Ferreira', date: '22/11/2023', total: 95.20, status: 'completed' }
    ];
    
    // Atualiza os cards de estatísticas
    updateStatCards(stats);
    
    // Atualiza a tabela de pedidos recentes
    updateRecentOrdersTable(recentOrders);
    
    // Inicializa os gráficos
    initCharts(stats);
}

// Função para atualizar os cards de estatísticas
function updateStatCards(stats) {
    // Total de Pedidos
    const totalOrdersElement = document.getElementById('total-orders');
    if (totalOrdersElement) {
        totalOrdersElement.textContent = stats.totalOrders;
    }
    
    // Receita Total
    const totalRevenueElement = document.getElementById('total-revenue');
    if (totalRevenueElement) {
        totalRevenueElement.textContent = `R$ ${stats.totalRevenue.toFixed(2).replace('.', ',')}`;
    }
    
    // Total de Clientes
    const totalCustomersElement = document.getElementById('total-customers');
    if (totalCustomersElement) {
        totalCustomersElement.textContent = stats.totalCustomers;
    }
    
    // Pedidos Pendentes
    const pendingOrdersElement = document.getElementById('pending-orders');
    if (pendingOrdersElement) {
        pendingOrdersElement.textContent = stats.pendingOrders;
    }
}

// Função para atualizar a tabela de pedidos recentes
function updateRecentOrdersTable(orders) {
    const tbody = document.querySelector('#recent-orders-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        
        let statusClass = '';
        let statusText = '';
        
        switch(order.status) {
            case 'completed':
                statusClass = 'completed';
                statusText = 'Concluído';
                break;
            case 'processing':
                statusClass = 'processing';
                statusText = 'Em preparo';
                break;
            case 'pending':
                statusClass = 'pending';
                statusText = 'Pendente';
                break;
            default:
                statusClass = 'cancelled';
                statusText = 'Cancelado';
        }
        
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>R$ ${order.total.toFixed(2).replace('.', ',')}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td class="text-right">
                <button class="btn btn-sm btn-primary">
                    <i class="fas fa-eye"></i> Ver
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Função para inicializar os gráficos
function initCharts(stats) {
    // Verifica se o Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js não está carregado. Os gráficos não serão exibidos.');
        return;
    }
    
    // Gráfico de vendas mensais
    const salesCtx = document.getElementById('sales-chart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [{
                    label: 'Vendas Mensais',
                    data: [1200, 1900, 1500, 2500, 2200, 3000, 2800, 2600, 3000, 3500, 3800, 4000],
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de categorias mais vendidas
    const categoriesCtx = document.getElementById('categories-chart');
    if (categoriesCtx) {
        new Chart(categoriesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Tradicionais', 'Especiais', 'Doces', 'Bebidas', 'Promoções'],
                datasets: [{
                    data: [35, 25, 15, 15, 10],
                    backgroundColor: [
                        '#e74c3c',
                        '#3498db',
                        '#f1c40f',
                        '#2ecc71',
                        '#9b59b6'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '70%'
            }
        });
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Simula o carregamento
    simulateLoading();
    
    // Verifica se está na página de login
    if (loginForm) {
        // Adiciona evento de submit ao formulário de login
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember').checked;
            
            // Mostra o loading
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
            
            try {
                await login(username, password);
                
                // Redireciona para o dashboard
                window.location.href = 'dashboard.html';
            } catch (error) {
                // Mostra mensagem de erro
                showNotification(error.message, 'error');
                
                // Restaura o botão
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
        
        // Adiciona evento para mostrar/ocultar senha
        if (togglePassword) {
            togglePassword.addEventListener('click', togglePasswordVisibility);
        }
    }
    
    // Carrega o dashboard
    loadDashboard();
});

// Adiciona o evento de tecla Enter no campo de senha
if (passwordInput) {
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && loginForm) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
}

// Função para formatar valores monetários
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Exporta funções para uso global
window.admin = {
    logout,
    showNotification,
    formatCurrency
};
