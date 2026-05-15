<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/api";
import Swal from "sweetalert2";

const reservas = ref([]);
const dataFiltro = ref("");

async function carregarMinhasReservas() {
  try {
    const usuarioId = Number(localStorage.getItem("id"));

    let url = `/reservas/usuario/${usuarioId}`;

    // se tiver filtro de data
    if (dataFiltro.value) {
      url = `/reservas/usuario/${usuarioId}/data/${dataFiltro.value}`;
    }

    const response = await api.get(url);
    reservas.value = response.data;
  } catch (error) {
    Swal.fire("Erro", "Erro ao carregar suas reservas", "error");
  }
}

function corStatus(status) {
  if (status === "PENDENTE") return "status pendente";
  if (status === "APROVADO") return "status aprovado";
  if (status === "RECUSADO") return "status recusado";
  if (status === "FINALIZADO") return "status finalizado";
  return "status";
}

async function devolverChave(id) {
  const confirmacao = await Swal.fire({
    title: "Devolver chave?",
    text: "Isso vai finalizar sua reserva.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, devolver",
    cancelButtonText: "Cancelar",
  });

  if (!confirmacao.isConfirmed) return;

  try {
    await api.put(`/reservas/${id}/devolver`);

    Swal.fire("Sucesso!", "Chave devolvida com sucesso!", "success");
    carregarMinhasReservas();
  } catch (error) {
    Swal.fire(
      "Erro",
      error.response?.data?.message || "Erro ao devolver chave",
      "error"
    );
  }
}

function limparFiltro() {
  dataFiltro.value = "";
  carregarMinhasReservas();
}

onMounted(() => {
  carregarMinhasReservas();
});
</script>

<template>
  <div class="page">
    <h2 class="titulo">Minhas Reservas</h2>

    <div class="filtro">
      <div class="campo">
        <label><b>Filtrar por Data</b></label>
        <input type="date" v-model="dataFiltro" />
      </div>

      <button class="btn btn-blue" @click="carregarMinhasReservas">
        Buscar
      </button>

      <button class="btn btn-gray" @click="limparFiltro">
        Limpar
      </button>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Sala</th>
            <th>Início</th>
            <th>Fim Previsto</th>
            <th>Devolução Real</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="r in reservas" :key="r.id">
            <td>{{ r.id }}</td>
            <td>{{ r.data }}</td>
            <td>{{ r.sala?.nome }}</td>
            <td>{{ r.horaInicio }}</td>
            <td>{{ r.horaFim }}</td>

            <td>
              <span v-if="r.horaDevolucao">
                {{ r.horaDevolucao }}
              </span>
              <span v-else>-</span>
            </td>

            <td>
              <span class="status-badge" :class="corStatus(r.status)">
                {{ r.status }}
              </span>
            </td>

            <td>
              <button
                v-if="r.status === 'APROVADO'"
                class="btn btn-green"
                @click="devolverChave(r.id)"
              >
                Devolver
              </button>

              <span v-else class="texto-cinza">---</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="reservas.length === 0" class="msg">
      Nenhuma reserva encontrada.
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

.filtro {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: end;
  margin-bottom: 15px;

  background: white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.08);
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
  min-width: 170px;
}

.table-container {
  background: white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 850px;
}

th,
td {
  border-bottom: 1px solid #eee;
  padding: 10px;
  text-align: left;
  font-size: 14px;
}

thead {
  background: #f5f5f5;
}

.status-badge {
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 12px;
}

.pendente {
  background: #fef3c7;
  color: #92400e;
}

.aprovado {
  background: #d1fae5;
  color: #065f46;
}

.recusado {
  background: #fee2e2;
  color: #991b1b;
}

.finalizado {
  background: #dbeafe;
  color: #1e40af;
}

.btn {
  padding: 9px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.btn-blue {
  background: #0072ce;
  color: white;
}

.btn-green {
  background: #16a34a;
  color: white;
}

.btn-gray {
  background: #e5e7eb;
  color: #111827;
}

.texto-cinza {
  color: gray;
}

.msg {
  margin-top: 15px;
  color: gray;
}
</style>