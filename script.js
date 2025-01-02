document.addEventListener("DOMContentLoaded", function () {
  let listaProdutos = [];

  function adicionarProduto() {
    const nome = document.getElementById("nome").value;
    const quantidade = document.getElementById("quantidade").value;
    const valor = document.getElementById("valor").value;

    const produto = { nome, quantidade, valor };
    listaProdutos.push(produto);

    atualizarTabela();
    calcularTotal();
    salvarListaNoLocalStorage();

    // Limpar o formulário
    document.getElementById("nome").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("valor").value = "";
  }

  function atualizarTabela() {
    const tbody = document.getElementById("lista-produtos");
    tbody.innerHTML = "";

    for (let i = 0; i < listaProdutos.length; i++) {
      const produto = listaProdutos[i];
      const tr = document.createElement("tr");

      const tdNome = document.createElement("td");
      tdNome.textContent = produto.nome;
      tr.appendChild(tdNome);

      const tdQuantidade = document.createElement("td");
      tdQuantidade.textContent = produto.quantidade;
      tr.appendChild(tdQuantidade);

      const tdValor = document.createElement("td");
      tdValor.textContent = produto.valor;
      tr.appendChild(tdValor);

      const tdAcoes = document.createElement("td");
      const botaoEditar = document.createElement("button");
      botaoEditar.textContent = "Editar";
      botaoEditar.onclick = () => editarProduto(i);
      tdAcoes.appendChild(botaoEditar);

      const botaoExcluir = document.createElement("button");
      botaoExcluir.textContent = "Excluir";
      botaoExcluir.onclick = () => excluirProduto(i);
      tdAcoes.appendChild(botaoExcluir);

      tr.appendChild(tdAcoes);

      tbody.appendChild(tr);
    }
  }

  function editarProduto(index) {
    const produto = listaProdutos[index];
    document.getElementById("nome").value = produto.nome;
    document.getElementById("quantidade").value = produto.quantidade;
    document.getElementById("valor").value = produto.valor;

    listaProdutos.splice(index, 1);
    atualizarTabela();
  }

  function excluirProduto(index) {
    listaProdutos.splice(index, 1);
    atualizarTabela();
    calcularTotal();
    salvarListaNoLocalStorage();
  }

  function calcularTotal() {
    let total = 0;

    for (const produto of listaProdutos) {
      const valor = parseFloat(produto.valor);
      const quantidade = parseFloat(produto.quantidade);
      total += valor * quantidade;
    }

    const resultado = document.getElementById("resultado");
    resultado.textContent = `Total da Compra: R$ ${total.toFixed(2)}`;

    return total.toFixed(2);
  }

  function exportarLista() {
    if (listaProdutos.length === 0) {
      alert("A lista de produtos está vazia. Adicione produtos antes de exportar.");
      return;
    }

    // Criar uma nova planilha Excel
    const ws = XLSX.utils.json_to_sheet(listaProdutos);

    // Adicionar o valor total à última linha da planilha
    const totalRow = { nome: 'Total', quantidade: '', valor: calcularTotal() };
    XLSX.utils.sheet_add_json(ws, [totalRow], { skipHeader: true, origin: -1 });

    // Criar um livro
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lista de Compras");

    // Salvar o arquivo
    XLSX.writeFile(wb, 'lista_compras.xlsx');
  }

  // Função para converter string em ArrayBuffer
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  function salvarListaNoLocalStorage() {
    localStorage.setItem("listaProdutos", JSON.stringify(listaProdutos));
  }

  function recuperarListaDoLocalStorage() {
    const listaSalva = localStorage.getItem("listaProdutos");

    if (listaSalva) {
      listaProdutos = JSON.parse(listaSalva);
      atualizarTabela();
      calcularTotal();
    }
  }

  // Vincule as funções aos botões
  document.getElementById("adicionarBtn").addEventListener("click", adicionarProduto);
  document.getElementById("calcularTotalBtn").addEventListener("click", calcularTotal);
  document.getElementById("exportarListaBtn").addEventListener("click", exportarLista);

  // Chamar a função para exibir data e hora
  exibirDataHora();

  recuperarListaDoLocalStorage();
});

function exibirDataHora() {
  function atualizarHora() {
    var agora = new Date();
    var dataHoraFormatada = agora.toLocaleString();
    document.getElementById("data-hora").textContent = "Data e Hora: " + dataHoraFormatada;
  }

  // Atualizar a hora a cada segundo
  setInterval(atualizarHora, 1000);

  // Chamar a função imediatamente para exibir a hora inicial
  atualizarHora();
}
