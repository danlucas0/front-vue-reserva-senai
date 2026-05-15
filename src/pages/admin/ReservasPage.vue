<script setup>
import { ref, onMounted, watch } from "vue";
import api from "../../api/api";
import Swal from "sweetalert2";

const reservas = ref([]);
const data = ref("");

async function carregarReservas() {
  try {
    if (data.value) {
      const response = await api.get(`/reservas/data/${data.value}`);
      reservas.value = response.data;
    } else {
      const response = await api.get("/reservas");
      reservas.value = response.data;
    }
  } catch (error) {
    Swal.fire("Erro", "Erro ao carregar reservas", "error");
  }
}

async function atualizarStatus(id, status) {
  try {
    await api.put(`/reservas/${id}/status?status=${status}`);
    Swal.fire("Sucesso!", "Status atualizado!", "success");
    await carregarReservas();
  } catch (error) {
    Swal.fire(
      "Erro!",
      error.response?.data?.message || "Erro ao atualizar status",
      "error"
    );
  }
}

async function devolverChave(id) {
  try {
    await api.put(`/reservas/${id}/devolver`);
    Swal.fire("Sucesso!", "Chave devolvida!", "success");
    await carregarReservas();
  } catch (error) {
    Swal.fire(
      "Erro!",
      error.response?.data?.message || "Erro ao devolver chave",
      "error"
    );
  }
}

function corStatus(status) {
  if (status === "PENDENTE") return "orange";
  if (status === "APROVADO") return "green";
  if (status === "RECUSADO") return "red";
  if (status === "FINALIZADO") return "blue";
  return "gray";
}

onMounted(() => {
  carregarReservas();
});

watch(data, () => {
  carregarReservas();
});
</script>

<template>
  <div class="card">
    <h2 class="title">Reservas (Admin)</h2>

    <div class="filter">
      <label><b>Filtrar por data:</b></label>
      <input class="input" type="date" v-model="data" />
      <button class="btn btn-gray" @click="data = ''">Limpar</button>
    </div>

    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Início</th>
            <th>Fim Previsto</th>
            <th>Devolução</th>
            <th>Sala</th>
            <th>Professor</th>
            <th>Status</th>
            <th style="min-width: 200px">Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="r in reservas" :key="r.id">
            <td>{{ r.id }}</td>
            <td>{{ r.data }}</td>
            <td>{{ r.horaInicio }}</td>
            <td>{{ r.horaFim }}</td>

            <td>
              <b v-if="r.horaDevolucao">{{ r.horaDevolucao }}</b>
              <span v-else>-</span>
            </td>

            <td>{{ r.sala?.nome }}</td>
            <td>{{ r.usuario?.nome }}</td>

            <td>
              <span class="badge" :class="corStatus(r.status)">
                {{ r.status }}
              </span>
            </td>

            <td class="actions">
              <button
                v-if="r.status === 'PENDENTE'"
                class="btn btn-green"
                @click="atualizarStatus(r.id, 'APROVADO')"
              >
                Aprovar
              </button>

              <button
                v-if="r.status === 'PENDENTE'"
                class="btn btn-orange"
                @click="atualizarStatus(r.id, 'RECUSADO')"
              >
                Recusar
              </button>

              <button
                v-if="r.status === 'APROVADO'"
                class="btn btn-blue"
                @click="devolverChave(r.id)"
              >
                Devolver
              </button>

              <span v-if="r.status === 'FINALIZADO'" class="finalizado">
                ✔ Finalizado
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
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

.filter {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 15px;
}

.input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.btn {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.btn-gray {
  background: #ccc;
  color: #333;
}

.btn-green {
  background: #2ecc71;
  color: white;
}

.btn-orange {
  background: #f39c12;
  color: white;
}

.btn-blue {
  background: #0072ce;
  color: white;
}

.table-wrapper {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  min-width: 950px;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.badge {
  padding: 5px 10px;
  border-radius: 8px;
  font-weight: bold;
  color: white;
  display: inline-block;
}

.green {
  background: #2ecc71;
}

.orange {
  background: #f39c12;
}

.red {
  background: #e74c3c;
}

.blue {
  background: #0072ce;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.finalizado {
  font-weight: bold;
  color: #0072ce;
}
</style>