<script setup>
import { ref } from "vue";
import api from "../../api/api";
import Swal from "sweetalert2";

const data = ref("");
const horaInicio = ref("");
const horaFim = ref("");

const salas = ref([]);
const reservas = ref([]);

async function buscar() {
  if (!data.value) {
    Swal.fire("Atenção", "Selecione uma data!", "warning");
    return;
  }

  try {
    const resSalas = await api.get("/salas");
    salas.value = resSalas.data;

    const resReservas = await api.get(`/reservas/data/${data.value}`);
    reservas.value = resReservas.data;
  } catch (error) {
    Swal.fire("Erro", "Erro ao buscar salas/reservas", "error");
  }
}

function reservasDaSala(salaId) {
  return reservas.value
    .filter((r) => r.sala?.id === salaId)
    .filter((r) => r.status !== "RECUSADO" && r.status !== "FINALIZADO")
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
}

function salaOcupadaNoHorario(salaId) {
  if (!horaInicio.value || !horaFim.value) return false;

  const lista = reservasDaSala(salaId);

  return lista.some((r) => {
    return horaInicio.value < r.horaFim && horaFim.value > r.horaInicio;
  });
}

function statusColor(status) {
  if (status === "APROVADO") return "status aprovado";
  if (status === "PENDENTE") return "status pendente";
  return "status";
}

async function reservarSala(salaId) {
  if (!data.value || !horaInicio.value || !horaFim.value) {
    Swal.fire("Atenção", "Selecione data e horário antes de reservar!", "warning");
    return;
  }

  if (horaFim.value <= horaInicio.value) {
    Swal.fire("Erro", "Hora final deve ser maior que a inicial!", "error");
    return;
  }

  if (salaOcupadaNoHorario(salaId)) {
    Swal.fire("Indisponível", "Essa sala está ocupada nesse horário!", "error");
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

    Swal.fire("Sucesso!", "Reserva solicitada com sucesso!", "success");
    await buscar();
  } catch (error) {
    Swal.fire("Erro", error.response?.data?.message || "Erro ao reservar", "error");
  }
}
</script>

<template>
  <div class="page">
    <h2 class="titulo">Salas Disponíveis</h2>

    <div class="filtros">
      <div class="campo">
        <label>Data</label>
        <input type="date" v-model="data" />
      </div>

      <div class="campo">
        <label>Hora Início</label>
        <input type="time" v-model="horaInicio" />
      </div>

      <div class="campo">
        <label>Hora Fim</label>
        <input type="time" v-model="horaFim" />
      </div>

      <button class="btn btn-blue" @click="buscar">Buscar</button>
    </div>

    <div class="grid" v-if="salas.length > 0">
      <div
        v-for="s in salas"
        :key="s.id"
        class="card"
        :class="salaOcupadaNoHorario(s.id) ? 'ocupada' : 'livre'"
      >
        <div class="card-header">
          <h3>{{ s.nome }}</h3>

          <span v-if="horaInicio && horaFim">
            <span v-if="salaOcupadaNoHorario(s.id)" class="badge badge-red">
              OCUPADA NESSE HORÁRIO
            </span>
            <span v-else class="badge badge-green">
              LIVRE NESSE HORÁRIO
            </span>
          </span>

          <span v-else class="badge badge-gray">
            Informe horário para checar
          </span>
        </div>

        <div class="card-body">
          <p class="subtitulo">Reservas do dia:</p>

          <div v-if="reservasDaSala(s.id).length === 0" class="livre-text">
            🟢 Livre o dia todo
          </div>

          <div
            v-for="r in reservasDaSala(s.id)"
            :key="r.id"
            class="reserva-item"
          >
            <span :class="statusColor(r.status)">
              {{ r.status }}
            </span>

            <span class="hora">
              {{ r.horaInicio }} - {{ r.horaFim }}
            </span>

            <span class="prof">
              ({{ r.usuario?.nome }})
            </span>
          </div>
        </div>

        <button
          class="btn btn-green"
          @click="reservarSala(s.id)"
          :disabled="salaOcupadaNoHorario(s.id)"
        >
          Reservar essa sala
        </button>
      </div>
    </div>

    <p v-if="salas.length === 0" class="msg">
      Selecione uma data e clique em Buscar.
    </p>
  </div>
</template>

<style scoped>
.page {
  padding: 15px;
}

.titulo {
  font-size: 24px;
  margin-bottom: 15px;
}

.filtros {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: end;
  margin-bottom: 20px;
  background: white;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0px 0px 12px rgba(0,0,0,0.08);
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

input {
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ddd;
  min-width: 160px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 15px;
}

.card {
  background: white;
  padding: 15px;
  border-radius: 14px;
  box-shadow: 0px 0px 12px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card h3 {
  margin: 0;
  font-size: 18px;
}

.subtitulo {
  font-weight: bold;
  margin-bottom: 5px;
}

.reserva-item {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px;
  border-radius: 8px;
  background: #f5f5f5;
  margin-bottom: 6px;
}

.status {
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
}

.aprovado {
  background: #d1fae5;
  color: #065f46;
}

.pendente {
  background: #fef3c7;
  color: #92400e;
}

.hora {
  font-weight: bold;
}

.prof {
  color: gray;
  font-size: 13px;
}

.badge {
  font-size: 12px;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 10px;
  display: inline-block;
  width: fit-content;
}

.badge-green {
  background: #d1fae5;
  color: #065f46;
}

.badge-red {
  background: #fee2e2;
  color: #991b1b;
}

.badge-gray {
  background: #e5e7eb;
  color: #374151;
}

.livre-text {
  font-weight: bold;
  color: #047857;
  padding: 6px;
}

.btn {
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.btn-blue {
  background: #0072ce;
  color: white;
}

.btn-green {
  background: #16a34a;
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.msg {
  color: gray;
  margin-top: 15px;
}
</style>