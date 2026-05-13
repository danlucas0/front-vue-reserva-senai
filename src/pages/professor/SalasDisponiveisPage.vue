<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/api";
import Swal from "sweetalert2";

const salas = ref([]);
const reservas = ref([]);

const dataFiltro = ref("");

async function carregarSalas() {
  const res = await api.get("/salas");
  salas.value = res.data;
}

async function carregarReservas() {
  try {
    let url = "/reservas";

    if (dataFiltro.value) {
      url = `/reservas?data=${dataFiltro.value}`;
    }

    const res = await api.get(url);
    reservas.value = res.data;
  } catch (error) {
    Swal.fire("Erro!", "Erro ao carregar reservas", "error");
  }
}

function salaDisponivel(salaId) {
  const ocupada = reservas.value.some(r =>
    r.sala?.id === salaId &&
    (r.status === "APROVADO" || r.status === "PENDENTE")
  );

  return !ocupada;
}

onMounted(() => {
  const hoje = new Date().toISOString().split("T")[0];
  dataFiltro.value = hoje;

  carregarSalas();
  carregarReservas();
});
</script>

<template>
  <div class="card">
    <h2 class="title">Salas Disponíveis</h2>

    <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
      <input class="input" type="date" v-model="dataFiltro" style="max-width: 220px" />
      <button class="btn btn-blue" @click="carregarReservas">Buscar</button>
    </div>
  </div>

  <div style="margin-top: 20px; display: grid; gap: 12px">
    <div
      v-for="s in salas"
      :key="s.id"
      class="card"
      :style="{
        borderLeft: salaDisponivel(s.id) ? '8px solid green' : '8px solid red'
      }"
    >
      <h3 style="margin: 0">{{ s.nome }}</h3>

      <p style="margin: 6px 0; font-weight: bold;"
         :style="{ color: salaDisponivel(s.id) ? 'green' : 'red' }">
        {{ salaDisponivel(s.id) ? "DISPONÍVEL" : "INDISPONÍVEL" }}
      </p>
    </div>
  </div>
</template>