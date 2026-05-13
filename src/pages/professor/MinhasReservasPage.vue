<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/api";
import Swal from "sweetalert2";

const reservas = ref([]);
const dataFiltro = ref("");

async function carregarMinhasReservas() {
  try {
    let url = "/reservas";

    if (dataFiltro.value) {
      url = `/reservas?data=${dataFiltro.value}`;
    }

    const response = await api.get(url);

    // professor vê só as dele (filtra no front por enquanto)
    const meuId = localStorage.getItem("id");
    reservas.value = response.data.filter(r => r.usuario?.id == meuId);

  } catch (error) {
    Swal.fire("Erro!", "Erro ao carregar reservas", "error");
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
  carregarMinhasReservas();
});
</script>

<template>
  <div class="card">
    <h2 class="title">Minhas Reservas</h2>

    <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
      <input class="input" type="date" v-model="dataFiltro" style="max-width: 220px" />
      <button class="btn btn-blue" @click="carregarMinhasReservas">Buscar</button>
    </div>
  </div>

  <div class="card" style="margin-top: 20px">
    <h2 class="title">Lista</h2>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Início</th>
            <th>Fim</th>
            <th>Sala</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="r in reservas" :key="r.id">
            <td>{{ r.id }}</td>
            <td>{{ r.data }}</td>
            <td>{{ r.horaInicio }}</td>
            <td>{{ r.horaFim }}</td>
            <td>{{ r.sala?.nome }}</td>
            <td :style="{ fontWeight: 'bold', color: corStatus(r.status) }">
              {{ r.status }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>