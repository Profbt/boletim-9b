// Configuração fixa do estudante (não editável)
const CONFIG_ALUNO = {
  turma: "9B",
  numeroChamada: 50,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// Variável em memória para guardar o PIN durante a sessão
let pinSessao = "";

// Dados fictícios padronizados locais — 9º Ano
let dadosDisciplinas = [
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

// Função obrigatória para normalizar as notas antigas/locais para a escala de 0 a 10
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  let num = valor;
  if (typeof valor === "string") {
    num = parseFloat(valor.replace(",", "."));
  }

  if (isNaN(num)) {
    return null;
  }

  if (num > 10 && num <= 100) {
    num = num / 10;
  }

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

  dadosDisciplinas.forEach((item) => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

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

    const arrFaltas = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];
    const totalFaltasDisciplina = arrFaltas.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    totalFaltasGeral += totalFaltasDisciplina;

    const txt1 = n1 !== null ? n1.toFixed(1).replace(".", ",") : "—";
    const txt2 = n2 !== null ? n2.toFixed(1).replace(".", ",") : "—";
    const txt3 = n3 !== null ? n3.toFixed(1).replace(".", ",") : "—";

    const tr = document.createElement("tr");

    const tdNome = document.createElement("td");
    tdNome.textContent = item.disciplina;

    const td1 = document.createElement("td");
    td1.textContent = txt1;

    const td2 = document.createElement("td");
    td2.textContent = txt2;

    const td3 = document.createElement("td");
    td3.textContent = txt3;

    const tdMedia = document.createElement("td");
    const strongMedia = document.createElement("strong");
    strongMedia.textContent = mediaFormatada;
    tdMedia.appendChild(strongMedia);

    const tdFaltas = document.createElement("td");
    tdFaltas.textContent = totalFaltasDisciplina;

    const tdSit = document.createElement("td");
    tdSit.className = classeSituacao;
    tdSit.textContent = situacao;

    tr.appendChild(tdNome);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(tdMedia);
    tr.appendChild(tdFaltas);
    tr.appendChild(tdSit);

    corpoTabela.appendChild(tr);
  });

  if (quantMediasValidas > 0) {
    const mediaGeral = somaMediasValidas / quantMediasValidas;
    document.getElementById("card-media-geral").textContent = mediaGeral.toFixed(1).replace(".", ",");
  } else {
    document.getElementById("card-media-geral").textContent = "—";
  }

  document.getElementById("card-total-faltas").textContent = totalFaltasGeral;
  document.getElementById("card-bom-desempenho").textContent = contBomDesempenho;
  document.getElementById("card-atencao").textContent = contAtencao;
}

// Manipulação da tela de login e comunicação com a API
document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const campoPin = document.getElementById("campo-pin");
  const msgLogin = document.getElementById("msg-login");
  const pinDigitado = campoPin.value.trim();

  if (!pinDigitado) return;

  msgLogin.className = "mensagem-status msg-info";
  msgLogin.textContent = "Conectando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      msgLogin.className = "mensagem-status msg-erro";
      msgLogin.textContent = "Turma, chamada ou PIN inválidos.";
      return;
    }

    if (resposta.status === 429) {
      msgLogin.className = "mensagem-status msg-erro";
      msgLogin.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      return;
    }

    if (!resposta.ok) {
      msgLogin.className = "mensagem-status msg-erro";
      msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      return;
    }

    const resultado = await resposta.json();

    // PIN armazenado apenas na memória da sessão
    pinSessao = pinDigitado;
    campoPin.value = "";

    // Se existirem dados na API, substitui completamente os dados locais
    if (resultado.dados && Array.isArray(resultado.dados.disciplinas)) {
      dadosDisciplinas = resultado.dados.disciplinas;
    }

    document.getElementById("secao-login").style.display = "none";
    document.getElementById("conteudo-boletim").style.display = "block";
    renderizarBoletim();

  } catch (erro) {
    msgLogin.className = "mensagem-status msg-erro";
    msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
  }
});

// Renderização e controle do formulário de edição
function abrirEdicao() {
  const corpoEdicao = document.getElementById("tabela-edicao-corpo");
  corpoEdicao.innerHTML = "";

  dadosDisciplinas.forEach((item, idx) => {
    const arrFaltas = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];
    
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const valN1 = n1 !== null ? String(n1).replace(".", ",") : "";
    const valN2 = n2 !== null ? String(n2).replace(".", ",") : "";
    const valN3 = n3 !== null ? String(n3).replace(".", ",") : "";

    const tr = document.createElement("tr");

    const tdNome = document.createElement("td");
    tdNome.textContent = item.disciplina;

    const createInputCell = (val, cls) => {
      const td = document.createElement("td");
      const inp = document.createElement("input");
      inp.type = "text";
      inp.className = `input-edicao ${cls}`;
      inp.value = val !== undefined && val !== null ? val : "";
      td.appendChild(inp);
      return td;
    };

    tr.appendChild(tdNome);
    tr.appendChild(createInputCell(valN1, "input-n1"));
    tr.appendChild(createInputCell(valN2, "input-n2"));
    tr.appendChild(createInputCell(valN3, "input-n3"));
    tr.appendChild(createInputCell(arrFaltas[0], "input-f1"));
    tr.appendChild(createInputCell(arrFaltas[1], "input-f2"));
    tr.appendChild(createInputCell(arrFaltas[2], "input-f3"));

    corpoEdicao.appendChild(tr);
  });

  document.getElementById("msg-edicao").textContent = "";
  document.getElementById("secao-edicao").style.display = "block";
}

document.getElementById("btn-alternar-edicao").addEventListener("click", () => {
  const secao = document.getElementById("secao-edicao");
  if (secao.style.display === "none") {
    abrirEdicao();
  } else {
    secao.style.display = "none";
  }
});

document.getElementById("btn-cancelar").addEventListener("click", () => {
  document.getElementById("secao-edicao").style.display = "none";
});

// Validação rigorosa dos campos de edição
function validarNotaDigitada(str) {
  const v = str.trim();
  if (v === "") return { valido: true, valor: null };
  const normal = v.replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(normal)) return { valido: false };
  const num = Number(normal);
  if (isNaN(num) || num < 0 || num > 10) return { valido: false };
  return { valido: true, valor: num };
}

function validarFaltaDigitada(str) {
  const v = str.trim();
  if (v === "") return { valido: false };
  if (!/^\d+$/.test(v)) return { valido: false };
  const num = Number(v);
  if (isNaN(num) || num < 0) return { valido: false };
  return { valido: true, valor: num };
}

// Salvamento na API
document.getElementById("form-edicao").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msgEdicao = document.getElementById("msg-edicao");
  msgEdicao.textContent = "";

  const linhas = document.querySelectorAll("#tabela-edicao-corpo tr");
  let houverErro = false;
  const novasDisciplinas = [];

  // Limpa marcações de erro anteriores
  document.querySelectorAll(".input-edicao").forEach(i => i.classList.remove("campo-invalido"));

  linhas.forEach((tr, idx) => {
    const nomeDisc = dadosDisciplinas[idx].disciplina;

    const inN1 = tr.querySelector(".input-n1");
    const inN2 = tr.querySelector(".input-n2");
    const inN3 = tr.querySelector(".input-n3");
    const inF1 = tr.querySelector(".input-f1");
    const inF2 = tr.querySelector(".input-f2");
    const inF3 = tr.querySelector(".input-f3");

    const resN1 = validarNotaDigitada(inN1.value);
    if (!resN1.valido) { inN1.classList.add("campo-invalido"); houverErro = true; }

    const resN2 = validarNotaDigitada(inN2.value);
    if (!resN2.valido) { inN2.classList.add("campo-invalido"); houverErro = true; }

    const resN3 = validarNotaDigitada(inN3.value);
    if (!resN3.valido) { inN3.classList.add("campo-invalido"); houverErro = true; }

    const resF1 = validarFaltaDigitada(inF1.value);
    if (!resF1.valido) { inF1.classList.add("campo-invalido"); houverErro = true; }

    const resF2 = validarFaltaDigitada(inF2.value);
    if (!resF2.valido) { inF2.classList.add("campo-invalido"); houverErro = true; }

    const resF3 = validarFaltaDigitada(inF3.value);
    if (!resF3.valido) { inF3.classList.add("campo-invalido"); houverErro = true; }

    if (!houverErro) {
      novasDisciplinas.push({
        disciplina: nomeDisc,
        tri1: resN1.valor,
        tri2: resN2.valor,
        tri3: resN3.valor,
        faltas: [resF1.valor, resF2.valor, resF3.valor]
      });
    }
  });

  if (houverErro) {
    msgEdicao.className = "mensagem-status msg-erro";
    msgEdicao.textContent = "Verifique os campos destacados em vermelho. Notas devem ser de 0 a 10 (ou vazias) e faltas devem ser números inteiros (0 ou mais).";
    return;
  }

  msgEdicao.className = "mensagem-status msg-info";
  msgEdicao.textContent = "Salvando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: novasDisciplinas
        }
      })
    });

    if (!resposta.ok) {
      msgEdicao.className = "mensagem-status msg-erro";
      msgEdicao.textContent = "Erro ao salvar os dados no servidor. Tente novamente.";
      return;
    }

    dadosDisciplinas = novasDisciplinas;
    renderizarBoletim();

    msgEdicao.className = "mensagem-status msg-sucesso";
    msgEdicao.textContent = "Dados salvos com sucesso.";

    setTimeout(() => {
      document.getElementById("secao-edicao").style.display = "none";
    }, 1200);

  } catch (erro) {
    msgEdicao.className = "mensagem-status msg-erro";
    msgEdicao.textContent = "Falha de conexão com o servidor ao salvar.";
  }
});