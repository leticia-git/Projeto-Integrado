function carregarInsights() {
    fetch('http://localhost:5000/api/insights')
    .then(response => response.json())
        .then(data => {
            console.log("Dados recebidos:", data);  // Adicione isso para ver o JSON no console
            document.getElementById('grafico-quantidade').src = 'data:image/png;base64,' + data.grafico_quantidade;
            document.getElementById('grafico-valor').src = 'data:image/png;base64,' + data.grafico_valor;
            document.getElementById('totalEstoque').textContent = data.total_estoque.toFixed(2);
            document.getElementById('quantidadeTotal').textContent = data.quantidade_total;

            const quantidadeList = document.getElementById('quantidadePorCategoria');
            quantidadeList.innerHTML = '';
            for (const categoria in data.quantidade_por_categoria) {
                const li = document.createElement('li');
                li.textContent = `${categoria}: ${data.quantidade_por_categoria[categoria]}`;
                quantidadeList.appendChild(li);
            }

            const valorList = document.getElementById('valorPorCategoria');
            valorList.innerHTML = '';
            for (const categoria in data.valor_por_categoria) {
                const li = document.createElement('li');
                li.textContent = `${categoria}: R$ ${data.valor_por_categoria[categoria].toFixed(2)}`;
                valorList.appendChild(li);
            }
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));
}


window.onload = carregarInsights;
