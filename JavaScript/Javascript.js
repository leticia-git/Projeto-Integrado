document.getElementById('nivelAcesso').addEventListener('change', atualizarInterface);
document.getElementById('produtoForm').addEventListener('submit', adicionarProduto);

// Função para obter produtos do localStorage
function obterProdutos() {
  return JSON.parse(localStorage.getItem('produtos')) || [];
}

// Função para salvar produtos no localStorage
function salvarProdutos(produtos) {
  localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Carregar produtos e atualizar tabela
function carregarProdutos() {
  const produtos = obterProdutos();
  const tabela = document.getElementById('produtosTable').querySelector('tbody');
  tabela.innerHTML = '';

  produtos.forEach(produto => {
    const valorEstoque = produto.preco * produto.quantidade;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${produto.ultimaModificacao || 'N/A'}</td> <!-- Coluna Última Modificação -->
      <td>${produto.id}</td>
      <td>${produto.nome}</td>
      <td>${produto.categoria}</td>
      <td>${produto.quantidade}</td>
      <td>R$ ${produto.preco.toFixed(2)}</td>
      <td>${produto.localizacao}</td>
      <td>R$ ${valorEstoque.toFixed(2)}</td>
      <td>
        <button onclick="editarProduto(${produto.id})">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.9199 1.72583L13.2744 2.08032C13.5498 2.35571 13.5498 2.80103 13.2744 3.07349L12.4219 3.92896L11.0713 2.57837L11.9238 1.72583C12.1992 1.45044 12.6445 1.45044 12.917 1.72583H12.9199ZM6.14648 7.5061L10.0781 3.57153L11.4287 4.92212L7.49414 8.85376C7.40918 8.93872 7.30371 9.00024 7.18945 9.03247L5.47559 9.52173L5.96484 7.80786C5.99707 7.6936 6.05859 7.58813 6.14355 7.50317L6.14648 7.5061ZM10.9307 0.732666L5.15039 6.51001C4.89551 6.76489 4.71094 7.07837 4.61426 7.42114L3.77637 10.3508C3.70605 10.5969 3.77344 10.8606 3.95508 11.0422C4.13672 11.2239 4.40039 11.2913 4.64648 11.2209L7.57617 10.3831C7.92188 10.2834 8.23535 10.0989 8.48731 9.84692L14.2676 4.06958C15.0908 3.24634 15.0908 1.9104 14.2676 1.08716L13.9131 0.732666C13.0898 -0.0905762 11.7539 -0.0905762 10.9307 0.732666ZM2.57812 1.87524C1.1543 1.87524 0 3.02954 0 4.45337V12.4221C0 13.8459 1.1543 15.0002 2.57812 15.0002H10.5469C11.9707 15.0002 13.125 13.8459 13.125 12.4221V9.14087C13.125 8.75122 12.8115 8.43774 12.4219 8.43774C12.0322 8.43774 11.7188 8.75122 11.7188 9.14087V12.4221C11.7188 13.0696 11.1943 13.594 10.5469 13.594H2.57812C1.93066 13.594 1.40625 13.0696 1.40625 12.4221V4.45337C1.40625 3.80591 1.93066 3.28149 2.57812 3.28149H5.85938C6.24902 3.28149 6.5625 2.96802 6.5625 2.57837C6.5625 2.18872 6.24902 1.87524 5.85938 1.87524H2.57812Z" fill="#9C6CF9"/>
        </svg>
        </button>
        <button onclick="excluirProduto(${produto.id})">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.7103 1.75828C15.1516 1.30296 15.0813 0.626677 14.5501 0.24836C14.0189 -0.129957 13.2299 -0.0696943 12.7886 0.385626L7.5 5.82603L2.21144 0.385626C1.77008 -0.0696943 0.98109 -0.129957 0.44989 0.24836C-0.0813089 0.626677 -0.151615 1.30296 0.289749 1.75828L5.87125 7.5L0.289749 13.2417C-0.151615 13.697 -0.0813089 14.3733 0.44989 14.7516C0.98109 15.13 1.77008 15.0697 2.21144 14.6144L7.5 9.17397L12.7886 14.6144C13.2299 15.0697 14.0189 15.13 14.5501 14.7516C15.0813 14.3733 15.1516 13.697 14.7103 13.2417L9.12875 7.5L14.7103 1.75828Z" fill="#9C6CF9"/>
        </svg>
        </button>
      </td>
    `;
    tabela.appendChild(row);
  });

  atualizarInterface();
}

// Adicionar ou atualizar produto
function adicionarProduto(event) {
  event.preventDefault();
  const nivelAcesso = document.getElementById('nivelAcesso').value;

  if (nivelAcesso === 'usuario') {
    alert('Usuário não tem permissão para adicionar produtos.');
    return;
  }

  const nome = document.getElementById('nome').value;
  const categoria = document.getElementById('categoria').value;
  const quantidade = parseInt(document.getElementById('quantidade').value);
  const preco = parseFloat(document.getElementById('preco').value);
  const localizacao = document.getElementById('localizacao').value;
  const dataAtual = new Date().toLocaleString();

  let produtos = obterProdutos();
  const produtoExistenteIndex = produtos.findIndex(p => p.id === parseInt(event.target.dataset.id));

  if (produtoExistenteIndex >= 0) {
    // Atualizar o produto existente
    produtos[produtoExistenteIndex] = { ...produtos[produtoExistenteIndex], nome, categoria, quantidade, preco, localizacao, ultimaModificacao: dataAtual };
    delete event.target.dataset.id; // Remover o id do dataset após a edição
  } else {
    // Adicionar novo produto
    const novoProduto = { id: Date.now(), nome, categoria, quantidade, preco, localizacao, ultimaModificacao: dataAtual };
    produtos.push(novoProduto);
  }

  salvarProdutos(produtos);
  carregarProdutos();
  event.target.reset();
  modal.style.display = 'none'; // Fechar o modal após a adição/edição
}

// Editar produto
function editarProduto(id) {
  const nivelAcesso = document.getElementById('nivelAcesso').value;

  if (nivelAcesso !== 'gerente') {
    alert('Apenas gerentes podem editar produtos.');
    return;
  }

  const produtos = obterProdutos();
  const produto = produtos.find(p => p.id === id);
  if (produto) {
    document.getElementById('nome').value = produto.nome;
    document.getElementById('categoria').value = produto.categoria;
    document.getElementById('quantidade').value = produto.quantidade;
    document.getElementById('preco').value = produto.preco;
    document.getElementById('localizacao').value = produto.localizacao;
    document.getElementById('produtoForm').dataset.id = id; // Armazenar o id do produto no dataset do formulário
    modal.style.display = 'flex';
  }
}

// Excluir produto
function excluirProduto(id, confirmar = true) {
  const nivelAcesso = document.getElementById('nivelAcesso').value;

  if (nivelAcesso !== 'gerente') {
    alert('Apenas gerentes podem excluir produtos.');
    return;
  }

  if (confirmar && !confirm('Tem certeza que deseja excluir este produto?')) return;

  let produtos = obterProdutos();
  produtos = produtos.filter(produto => produto.id !== id);
  salvarProdutos(produtos);

  carregarProdutos();
}

// Atualizar interface com base no nível de acesso
function atualizarInterface() {
  const nivelAcesso = document.getElementById('nivelAcesso').value;
  const formElements = document.querySelectorAll('#produtoForm input, #produtoForm button');

  formElements.forEach(el => {
    el.disabled = (nivelAcesso === 'usuario');
  });

  const botoesExcluir = document.querySelectorAll('#produtosTable button');

  botoesExcluir.forEach(btn => {
    if (btn.innerText === 'Excluir' || btn.innerText === 'Editar') {
      btn.style.display = (nivelAcesso === 'gerente') ? 'inline-block' : 'none';
    }
  });
}

// Carregar a tabela de produtos ao iniciar
carregarProdutos();
