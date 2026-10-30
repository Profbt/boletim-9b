// Dados fictícios padronizados — 9º Ano
const dadosDisciplinas = [
  { disciplina: "Língua Portuguesa", tri1: 78, tri2: "8,2", tri3: 8.6, faltas: [2, 2, 1] },
  { disciplina: "Matemática", tri1: 55, tri2: "5,4", tri3: null, faltas: [3, 2, 2] },
  { disciplina: "Ciências", tri1: 84, tri2: 7.9, tri3: "8,3", faltas: [1, 1, 1] },
  { disciplina: "História", tri1: "7,1", tri2: 82, tri3: null, faltas: [1, 2, 1] },
  { disciplina: "Geografia", tri1: 69, tri2: "7,5", tri3: 7.8, faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 88, tri2: 8.4, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Arte", tri1: "9,2", tri2: 87, tri3: 9.0, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 96, tri2: "9,3", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 91, tri2: 8.9, tri3: "9,4", faltas: [1, 1, 0] },
  { disciplina: "Educação Financeira", tri1: 76, tri2: "7,2", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Rec. Aprend. Matemática", tri1: 58, tri2: "5,9", tri3: 6.2, faltas: [2, 2, 1] },
  { disciplina: "Leitura Rec. Aprend. Lingua Portuguesa", tri1: 72, tri2: "7,6", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 49, tri2: 5.5, tri3: "5,8", faltas: [2, 2, 2] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,0", tri2: 84, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 64, tri2: "6,6", tri3: 7.0, faltas: [1, 1, 1] }
];

// Função obrigatória para normalizar as notas para a escala de 0 a 10
function normalizarNota(valor) {
  // Trata notas ausentes
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Converte texto com vírgula para número (ex: "8,5" vira 8.5)
  let num = valor;
  if (typeof valor === "string") {
    num = parseFloat(valor.replace(",", "."));
  }

  // Se a conversão não gerou um número válido, descarta
  if (isNaN(num)) {
    return null;
  }

  // Ajusta valores na escala 0-100 para a escala 0-10
  if (num > 10 && num <= 100) {
    num = num / 10;
  }

  // Retorna a nota apenas se estiver entre 0 e 10
  if (num >= 0 && num <= 10) {
    return num;
  }

  return null;
}

// Função principal que processa e exibe as informações no site
function renderizarBoletim() {
  const corpoTabela = document.getElementById("tabela-corpo");
  corpoTabela.innerHTML = "";

  let somaMediasValidas = 0;
  let quantMediasValidas = 0;
  let totalFaltasGeral = 0;
  let contBomDesempenho = 0;
  let contAtencao = 0;

  // Percorre cada uma das 15 disciplinas do array
  dadosDisciplinas.forEach((item) => {
    // Normaliza as 3 notas
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    // Calcula a média das notas disponíveis (ignora notas nulas/ausentes)
    const notasValidas = [n1, n2, n3].filter((n) => n !== null);
    let mediaFormatada = "—";
    let situacao = "Nota ainda não disponível";
    let classeSituacao = "status-indisponivel";

    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, curr) => acc + curr, 0);
      const media = soma / notasValidas.length;
      mediaFormatada = media.toFixed(1).replace(".", ",");

      somaMediasValidas += media;
      quantMediasValidas++;

      if (media >= 6.0) {
        situacao = "Bom desempenho";
        classeSituacao = "status-bom";
        contBomDesempenho++;
      } else {
        situacao = "Atenção";
        classeSituacao = "status-atencao";
        contAtencao++;
      }
    }

    // Soma as faltas dos três trimestres
    const totalFaltasDisciplina = item.faltas.reduce((acc, curr) => acc + curr, 0);
    totalFaltasGeral += totalFaltasDisciplina;

    // Formatação das notas para exibição na tabela
    const txt1 = n1 !== null ? n1.toFixed(1).replace(".", ",") : "—";
    const txt2 = n2 !== null ? n2.toFixed(1).replace(".", ",") : "—";
    const txt3 = n3 !== null ? n3.toFixed(1).replace(".", ",") : "—";

    // Cria a linha HTML da tabela para a disciplina
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.disciplina}</td>
      <td>${txt1}</td>
      <td>${txt2}</td>
      <td>${txt3}</td>
      <td><strong>${mediaFormatada}</strong></td>
      <td>${totalFaltasDisciplina}</td>
      <td class="${classeSituacao}">${situacao}</td>
    `;
    corpoTabela.appendChild(tr);
  });

  // Atualiza os cards superiores com os resumos
  if (quantMediasValidas > 0) {
    const mediaGeral = somaMediasValidas / quantMediasValidas;
    document.getElementById("card-media-geral").textContent = mediaGeral.toFixed(1).replace(".", ",");
  } else {
    document.getElementById("card-media-geral").textContent = "—";
  }

  document.getElementById("card-total-faltas").textContent = totalFaltasGeral;
  document.getElementById("card-bom-desempenho").textContent = contBomDesempenho;
  document.getElementById("card-atencao").textContent = contAtencao;

  /*
    NOTA SOBRE A FREQUÊNCIA GERAL:
    O valor de 92% exibido no card HTML é apenas DEMONSTRATIVO/FICTÍCIO nesta primeira fase.
    Ele não é calculado a partir das faltas e será tratado de forma dinâmica em uma versão futura.
  */
}

// Executa a função assim que o arquivo JavaScript carrega
renderizarBoletim();