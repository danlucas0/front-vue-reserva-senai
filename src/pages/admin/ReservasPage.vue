<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/api";
import Swal from "sweetalert2";

const reservas = ref([]);
const dataFiltro = ref("");

async function carregarReservas() {
  try {
    let url = "/reservas";

    if (dataFiltro.value) {
      url = `/reservas?data=${dataFiltro.value}`;
    }

    const response = await api.get(url);
    reservas.value = response.data;
  } catch (error) {
    Swal.fire("Erro!", "Erro ao carregar reservas", "error");
  }
}

async function atualizarStatus(id, status) {
  try {
    await api.put(`/reservas/${id}/status?status=${status}`);
    Swal.fire("Sucesso!", "Status atualizado!", "success");
    carregarReservas();
  } catch (error) {
    Swal.fire("Erro!", error.response?.data?.message || "Erro ao atualizar status", "error");
  }
}

async function devolverChave(reserva) {
  let hora = await Swal.fire({
    title: "Devolver chave",
    text: "Digite a hora da devolução (ex: 13:00). Se vazio, pega hora atual.",
    input: "text",
    inputPlaceholder: "13:00",
    showCancelButton: true,
    confirmButtonText: "Finalizar",
    cancelButtonText: "Cancelar",
  });

  if (!hora.isConfirmed) return;

  try {
    if (!hora.value || hora.value.trim() === "") {
      await api.put(`/reservas/${reserva.id}/devolver`);
    } else {
      await api.put(`/reservas/${reserva.id}/devolver`, {
        horaDevolucao: hora.value,
      });
    }

    Swal.fire("Sucesso!", "Reserva finalizada!", "success");
    carregarReservas();
  } catch (error) {
    Swal.fire("Erro!", error.response?.data?.message || "Erro ao devolver chave", "error");
  }
}

async function deletarReserva(id) {
  const confirm = await Swal.fire({
    title: "Tem certeza?",
    text: "Isso vai deletar a reserva!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim",
    cancelButtonText: "Cancelar",
  });

  if (!confirm.isConfirmed) return;

  try {
    await api.delete(`/reservas/${id}`);
    Swal.fire("Deletado!", "Reserva removida.", "success");
    carregarReservas();
  } catch (error) {
    Swal.fire("Erro!", error.response?.data?.message || "Erro ao deletar", "error");
  }
}

function corStatus(status) {
  if (status === "PENDENTE") return "orange";
  if (status === "APROVADO") return "green";
  if (status === "RECUSADO") return "red";
  if (status === "FINALIZADO") return "blue";
  return "black";
}

onMounted(() => {
  const hoje = new Date().toISOString().split("T")[0];
  dataFiltro.value = hoje;
  carregarReservas();
});
</script>

<template>
  <div class="card">
    <h2 class="title">Reservas (Admin)</h2>

    <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
      <input class="input" type="date" v-model="dataFiltro" style="max-width: 220px" />
      <button class="btn btn-blue" @click="carregarReservas">Buscar</button>
    </div>
  </div>

  <div class="card" style="margin-top: 20px">
    <h2 class="title">Lista de Reservas</h2>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Início</th>
            <th>Fim</th>
            <th>Devolução</th>
            <th>Usuário</th>
            <th>Sala</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="r in reservas" :key="r.id">
            <td>{{ r.id }}</td>
            <td>{{ r.data }}</td>
            <td>{{ r.horaInicio }}</td>
            <td>{{ r.horaFim }}</td>
            <td>{{ r.horaDevolucao ? r.horaDevolucao : "-" }}</td>
            <td>{{ r.usuario?.nome }}</td>
            <td>{{ r.sala?.nome }}</td>

            <td :style="{ fontWeight: 'bold', color: corStatus(r.status) }">
              {{ r.status }}
            </td>

            <td style="display: flex; gap: 6px; flex-wrap: wrap;">
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
                @click="devolverChave(r)"
              >
                Devolver
              </button>

              <button class="btn btn-red" @click="deletarReserva(r.id)">
                Deletar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>