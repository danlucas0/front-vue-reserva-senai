<script setup>
import { ref, onMounted, computed, watch } from "vue";
import api from "../../api/api";
import Swal from "sweetalert2";

const salas = ref([]);
const reservasDoDia = ref([]);

const data = ref("");
const horaInicio = ref("");
const horaFim = ref("");

async function carregarSalas() {
  const response = await api.get("/salas");
  salas.value = response.data;
}

async function carregarReservasPorData() {
  if (!data.value) {
    reservasDoDia.value = [];
    return;
  }

  const response = await api.get(`/reservas/data/${data.value}`);
  reservasDoDia.value = response.data;
}

function temConflito(reserva) {
  if (!horaInicio.value || !horaFim.value) return false;

  return horaInicio.value < reserva.horaFim && horaFim.value > reserva.horaInicio;
}

function reservasDaSala(salaId) {
  return reservasDoDia.value
    .filter(
      (r) =>
        r.sala?.id === salaId &&
        r.status !== "RECUSADO" &&
        r.status !== "FINALIZADO"
    )
    .sort((a, b) => (a.horaInicio > b.horaInicio ? 1 : -1));
}

function statusSala(salaId) {
  if (!horaInicio.value || !horaFim.value) {
    return { status: "NEUTRO", texto: "Escolha um horário acima" };
  }

  const reservas = reservasDaSala(salaId);

  for (const r of reservas) {
    if (temConflito(r)) {
      if (r.status === "APROVADO") {
        return { status: "OCUPADA", texto: "Ocupada nesse horário" };
      }
      if (r.status === "PENDENTE") {
        return { status: "PENDENTE", texto: "Pendente nesse horário" };
      }
    }
  }

  return { status: "DISPONIVEL", texto: "Disponível nesse horário" };
}

async function reservarSala(salaId) {
  if (!data.value || !horaInicio.value || !horaFim.value) {
    Swal.fire("Atenção", "Preencha Data e Horário primeiro!", "warning");
    return;
  }

  if (horaFim.value <= horaInicio.value) {
    Swal.fire("Erro", "Hora final deve ser maior que a inicial!", "error");
    return;
  }

  const status = statusSala(salaId);

  if (status.status !== "DISPONIVEL") {
    Swal.fire("Indisponível", "Essa sala não está livre nesse horário!", "error");
    return;
  }

  try {
    await api.post("/reservas", {
      data: data.value,
      horaInicio: horaInicio.value,
      horaFim: horaFim.value,
      usuarioId: Number(localStorage.getItem("id")),
      salaId: salaId,
    });

    Swal.fire("Sucesso!", "Reserva solicitada!", "success");

    await carregarReservasPorData();
  } catch (error) {
    Swal.fire("Erro!", error.response?.data?.message || "Erro ao reservar", "error");
  }
}

const salasComStatus = computed(() => {
  return salas.value.map((s) => ({
    ...s,
    statusInfo: statusSala(s.id),
    reservas: reservasDaSala(s.id),
  }));
});

watch(data, async () => {
  await carregarReservasPorData();
});

onMounted(async () => {
  await carregarSalas();
});
</script>

<template>
  <div class="page">

    <div class="card">
      <h2 class="title">Nova Reserva</h2>

      <div class="form-grid">
        <div>
          <label><b>Data</b></label>
          <input class="input" type="date" v-model="data" />
        </div>

        <div>
          <label><b>Hora Início</b></label>
          <input class="input" type="time" v-model="horaInicio" />
        </div>

        <div>
          <label><b>Hora Fim</b></label>
          <input class="input" type="time" v-model="horaFim" />
        </div>
      </div>
    </div>

    <div class="card">
      <h2 class="title">Salas Disponíveis</h2>

      <div class="salas-grid">
        <div
          v-for="s in salasComStatus"
          :key="s.id"
          class="sala-card"
          :class="{
            green: s.statusInfo.status === 'DISPONIVEL',
            red: s.statusInfo.status === 'OCUPADA',
            orange: s.statusInfo.status === 'PENDENTE',
            gray: s.statusInfo.status === 'NEUTRO'
          }"
        >
          <h3 class="sala-nome">{{ s.nome }}</h3>

          <p class="status-text">
            <span v-if="s.statusInfo.status === 'DISPONIVEL'">🟢</span>
            <span v-if="s.statusInfo.status === 'OCUPADA'">🔴</span>
            <span v-if="s.statusInfo.status === 'PENDENTE'">🟠</span>
            <span v-if="s.statusInfo.status === 'NEUTRO'">⚪</span>

            {{ s.statusInfo.texto }}
          </p>

          <div v-if="data" class="agenda">
            <p v-if="s.reservas.length === 0" class="agenda-vazia">
              Nenhuma reserva nessa data
            </p>

            <div v-for="r in s.reservas" :key="r.id" class="agenda-item">
              <span v-if="r.status === 'APROVADO'">🔴</span>
              <span v-if="r.status === 'PENDENTE'">🟠</span>

              <b>{{ r.horaInicio }} - {{ r.horaFim }}</b>
              <span>({{ r.usuario?.nome }})</span>
            </div>
          </div>

          <button
            v-if="s.statusInfo.status === 'DISPONIVEL'"
            class="btn btn-blue"
            @click="reservarSala(s.id)"
          >
            Reservar
          </button>

          <button v-else class="btn btn-gray" disabled>
            Indisponível
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.page {
  display: grid;
  gap: 20px;
}

.card {
  background: white;
  padding: 18px;
  border-radius: 12px;
  box-shadow: 0px 0px 15px rgba(0,0,0,0.1);
}

.title {
  font-size: 22px;
  margin-bottom: 15px;
}

.form-grid {
  display: grid;
  gap: 12px;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.salas-grid {
  display: grid;
  gap: 12px;
}

@media (min-width: 600px) {
  .salas-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1000px) {
  .salas-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.sala-card {
  padding: 15px;
  border-radius: 12px;
  border: 2px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sala-nome {
  font-size: 18px;
}

.status-text {
  font-weight: bold;
}

.agenda {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 10px;
  font-size: 14px;
  display: grid;
  gap: 6px;
}

.agenda-item {
  padding: 6px;
  border-radius: 8px;
  background: white;
  border: 1px solid #eee;
}

.agenda-vazia {
  color: gray;
}

.green {
  border-color: #2ecc71;
}

.red {
  border-color: #e74c3c;
}

.orange {
  border-color: #f39c12;
}

.gray {
  border-color: #bbb;
}

.btn {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  margin-top: auto;
}

.btn-blue {
  background: #0072ce;
  color: white;
}

.btn-gray {
  background: #ccc;
  color: #555;
}
</style>