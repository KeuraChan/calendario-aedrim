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
// Renderiza o calendário
function renderCalendario() {
  const cal = document.getElementById("calendario");
  cal.innerHTML = "";
  document.getElementById("titulo").innerText = `${estacaoAtual} - Ano ${anoAtual}`;

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

        if (evento.comemorativa) {
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
        abrirModal(d, listaEventos, eventosDoDia.some((e) => e.comemorativa));
      };
    }

    cal.appendChild(dia);
  }
}


// Abre modal de eventos
// Abre modal de eventos
function abrirModal(dia, listaEventos, comemorativa) {
  document.getElementById("modal-data").innerText =
    `${dia} de ${estacaoAtual}, Ano ${anoAtual}`;

  const lista = document.getElementById("modal-eventos");
  lista.innerHTML = "";

  // Pega eventos do dia (comemorativos primeiro)
  const eventosDoDia = eventos.filter(
    (e) =>
      e.estacao === estacaoAtual &&
      e.dia === dia &&
      (e.ano === anoAtual || (e.comemorativa && anoAtual >= e.ano))
  );

  const comemorativos = eventosDoDia.filter((e) => e.comemorativa);
  const normais = eventosDoDia.filter((e) => !e.comemorativa);

  // --- Eventos comemorativos primeiro ---
  comemorativos.forEach((ev) => {
    ev.eventos.forEach((txt) => {
      const li = document.createElement("li");
      li.innerText = txt + " 🌟";
      li.style.color = "gold";
      li.style.fontWeight = "bold";
      lista.appendChild(li);
    });
  });

  // --- Separador se tiver os dois tipos ---
  if (comemorativos.length > 0 && normais.length > 0) {
    const separador = document.createElement("hr");
    separador.style.border = "none";
    separador.style.borderTop = "1px solid #ccc";
    separador.style.margin = "8px 0";
    lista.appendChild(separador);
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

// 🔥 Inicializa somente depois do DOM estar pronto
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("estacao").value = estacaoAtual;
  document.getElementById("ano").value = anoAtual;
  renderCalendario();
});
