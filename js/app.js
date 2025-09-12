// js/app.js
// Definição de dias por estação
const diasPorEstacao = {
  Primavera: 91,
  Verão: 91,
  Outono: 91,
  Inverno: 92,
};

const estacoes = ["Primavera", "Verão", "Outono", "Inverno"];


// Renderiza o calendário
function renderCalendario() {
  const cal = document.getElementById("calendario");
  cal.innerHTML = "";
  document.getElementById(
    "titulo"
  ).innerText = `${estacaoAtual} - Ano ${anoAtual}`;

  for (let d = 1; d <= diasPorEstacao[estacaoAtual]; d++) {
    const dia = document.createElement("div");
    dia.classList.add("dia");
    dia.innerText = d;

    // Busca eventos do dia
    const eventosDoDia = eventos.filter(
      (e) =>
        e.estacao === estacaoAtual &&
        e.dia === d &&
        (e.ano === anoAtual || (e.comemorativa && anoAtual >= e.ano))
    );

    if (eventosDoDia.length > 0) {
      // Cria um container para os marcadores
      const containerMarcadores = document.createElement("div");
      containerMarcadores.style.display = "flex";
      containerMarcadores.style.gap = "3px";
      containerMarcadores.style.marginTop = "5px";
      containerMarcadores.style.justifyContent = "center";

      eventosDoDia.forEach((evento) => {
        const marcador = document.createElement("div");
        marcador.classList.add("evento");

        if (evento.definidor) {
          marcador.innerText = "◆";
          marcador.style.background = "red";
          marcador.style.color = "white";
        } else if (evento.comemorativa) {
          marcador.innerText = "★";
          marcador.style.background = "gold";
          marcador.style.color = "black";
        } else {
          marcador.innerText = "●";
          marcador.style.background = "#3a8dde";
          marcador.style.color = "white";
        }

        containerMarcadores.appendChild(marcador);
      });

      dia.appendChild(containerMarcadores);

      // Clique abre o modal com todos os eventos do dia
      dia.onclick = () => {
        const listaEventos = eventosDoDia.flatMap((e) => e.eventos);
        abrirModal(
          d,
          listaEventos,
          eventosDoDia.some((e) => e.comemorativa)
        );
      };
    }

    cal.appendChild(dia);
  }
}

// Renderiza os eventos definidores
function renderDefinidores() {
  const lista = document.getElementById("definidores");
  if (!lista) return;
  lista.innerHTML = "";

  const estacaoOrdem = {
    "Primavera": 1,
    "Verão": 2,
    "Outono": 3,
    "Inverno": 4,
  };

  // filtra só os definidores
  const definidores = eventos.filter(e => e.definidor);

  // ordena do mais novo pro mais antigo
  definidores.sort((a, b) => {
    if (a.ano !== b.ano) return b.ano - a.ano; // ano desc
    if (a.estacao !== b.estacao) return estacaoOrdem[b.estacao] - estacaoOrdem[a.estacao]; // estacao desc
    return b.dia - a.dia; // dia desc
  });

  // monta lista
  definidores.forEach(ev => {
    const li = document.createElement("li");
    li.innerText = `${ev.eventos[0]} (${ev.estacao} ${ev.dia}, Ano ${ev.ano})`;
    li.onclick = () => irParaEvento(ev);
    lista.appendChild(li);
  });
}

function irParaEvento(ev) {
  // muda ano e estação
  anoAtual = ev.ano;
  estacaoAtual = ev.estacao;

  // atualiza os selects do HTML
  document.getElementById("estacao").value = estacaoAtual;
  document.getElementById("ano").value = anoAtual;

  // redesenha o calendário
  renderCalendario();

  // destaca o dia do evento
  const dias = document.querySelectorAll("#calendario .dia");
  dias.forEach(d => {
    if (parseInt(d.innerText) === ev.dia) {
      d.classList.add("selecionado");
      d.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      d.classList.remove("selecionado");
    }
  });

  fecharModal()
  // opcional: já abre o modal do evento
  abrirModal(ev.dia, ev.eventos);

}


// Abre modal de eventos
function abrirModal(dia, listaEventos) {
  const eventosDoDia = eventos.filter(
    (e) =>
      e.estacao === estacaoAtual &&
      e.dia === dia &&
      (e.ano === anoAtual || (e.comemorativa && anoAtual >= e.ano))
  );

  // monta título
  let titulo = `${dia} de ${estacaoAtual}, Ano ${anoAtual}`;
  if (eventosDoDia.some((e) => e.definidor)) titulo += " 🔴 (Evento Definidor)";
  else if (eventosDoDia.some((e) => e.comemorativa))
    titulo += " 🌟 (Comemorativo)";

  document.getElementById("modal-data").innerText = titulo;

  const lista = document.getElementById("modal-eventos");
  lista.innerHTML = "";

  // separa por tipo
  const definidores = eventosDoDia.filter((e) => e.definidor);
  const comemorativos = eventosDoDia.filter(
    (e) => e.comemorativa && !e.definidor
  );
  const normais = eventosDoDia.filter((e) => !e.comemorativa && !e.definidor);

  // --- Eventos definidores ---
  definidores.forEach((ev) => {
    ev.eventos.forEach((txt) => {
      const li = document.createElement("li");
      li.innerText = txt + " 🔴";
      li.style.color = "red";
      li.style.fontWeight = "bold";
      lista.appendChild(li);
    });
  });

  // separador
  if (definidores.length && (comemorativos.length || normais.length)) {
    const hr = document.createElement("hr");
    hr.style.border = "none";
    hr.style.borderTop = "1px solid #ccc";
    hr.style.margin = "8px 0";
    lista.appendChild(hr);
  }

  // --- Eventos comemorativos ---
  comemorativos.forEach((ev) => {
    ev.eventos.forEach((txt) => {
      const li = document.createElement("li");
      li.innerText = txt + " 🌟";
      li.style.color = "gold";
      li.style.fontWeight = "bold";
      lista.appendChild(li);
    });
  });

  // separador
  if (comemorativos.length && normais.length) {
    const hr = document.createElement("hr");
    hr.style.border = "none";
    hr.style.borderTop = "1px solid #ccc";
    hr.style.margin = "8px 0";
    lista.appendChild(hr);
  }

  // --- Eventos normais ---
  normais.forEach((ev) => {
    ev.eventos.forEach((txt) => {
      const li = document.createElement("li");
      li.innerText = txt;
      lista.appendChild(li);
    });
  });

  document.getElementById("modal").style.display = "flex";
}

// Fecha modal
function fecharModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("menu-definidores").style.display = "none";
}

// Troca estação pelo select
function mudarEstacao() {
  estacaoAtual = document.getElementById("estacao").value;
  renderCalendario();
}

// Troca ano pelo input
function mudarAno() {
  anoAtual = parseInt(document.getElementById("ano").value);
  if (anoAtual > 4900) anoAtual = 4900;
  renderCalendario();
}

// Navegação por botões (caso queira manter)
function proximo() {
  let idx = estacoes.indexOf(estacaoAtual);
  if (idx === 3) {
    anoAtual++;
    estacaoAtual = estacoes[0];
  } else {
    estacaoAtual = estacoes[idx + 1];
  }
  renderCalendario();
}

function anterior() {
  let idx = estacoes.indexOf(estacaoAtual);
  if (idx === 0) {
    anoAtual--;
    estacaoAtual = estacoes[3];
  } else {
    estacaoAtual = estacoes[idx - 1];
  }
  renderCalendario();
}


const toggleMenu = document.getElementById("toggle-menu");
const menuModal = document.getElementById("menu-definidores");

toggleMenu.addEventListener("click", () => {
  menuModal.style.display = "flex"; // abre
});

// Fechar clicando fora do conteúdo
menuModal.addEventListener("click", (e) => {
  if (e.target === menuModal) {
    menuModal.style.display = "none";
  }
});

// Opcional: fechar com ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    menuModal.style.display = "none";
  }
});


// 🔥 Inicializa somente depois do DOM estar pronto
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("estacao").value = estacaoAtual;
  document.getElementById("ano").value = anoAtual;
  renderCalendario();
  renderDefinidores();
});
