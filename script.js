document.addEventListener('DOMContentLoaded', () => {
    const BACKEND_URL = 'https://meu-dashboard-pedidos.onrender.com';

    const socket = io(BACKEND_URL);

    const statusDiv = document.getElementById('status-conexao');
    const pedidosContainer = document.getElementById('pedidos-container');
    const somNotificacao = document.getElementById('som-notificacao');
    const botaoSom = document.getElementById('ativar-som');

    let somAtivado = false;

    // Mostrar botão de ativar som
    botaoSom.style.display = 'block';

    botaoSom.addEventListener('click', () => {
        // Tenta tocar o som uma vez para desbloquear
        somNotificacao.play()
            .then(() => {
                somAtivado = true;
                botaoSom.style.display = 'none';
                console.log("🔊 Som ativado com sucesso!");
            })
            .catch(err => {
                console.warn("Erro ao ativar som:", err);
            });
    });

    socket.on('connect', () => {
        console.log('Conectado ao servidor de backend!');
        statusDiv.className = 'conectado';
        statusDiv.innerHTML = '<span></span> Conectado';
    });

    socket.on('disconnect', () => {
        console.log('Desconectado do servidor.');
        statusDiv.className = 'desconectado';
        statusDiv.innerHTML = '<span></span> Desconectado';
    });

    socket.on('novo_pedido', (pedido) => {
        console.log('Novo pedido recebido:', pedido);

        if (somAtivado) {
            somNotificacao.play().catch(error => {
                console.warn("Erro ao tocar som:", error);
            });
        }

        adicionarPedidoNaTela(pedido);
    });

    function adicionarPedidoNaTela(pedido) {
        const card = document.createElement('div');
        card.className = `pedido-card ${pedido.origem.split(' ')[0].toLowerCase()}`;

        card.innerHTML = `
            <div class="pedido-header">
                <span class="origem">${pedido.origem}</span>
                <span class="status">${pedido.status}</span>
            </div>
            <div class="pedido-info">
                <p><strong>ID do Pedido:</strong> ${pedido.id}</p>
                <p><strong>Cliente:</strong> ${pedido.cliente}</p>
                <p><strong>Valor:</strong> R$ ${parseFloat(pedido.valor).toFixed(2)}</p>
                <p><strong>Itens:</strong> ${pedido.itens}</p>
                <p><strong>Data:</strong> ${pedido.data}</p>
            </div>
        `;

        pedidosContainer.prepend(card);
    }
});
