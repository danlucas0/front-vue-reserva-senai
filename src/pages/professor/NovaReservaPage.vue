<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/api";
import Swal from "sweetalert2";

const salas = ref([]);

const data = ref("");
const horaInicio = ref("");
const horaFim = ref("");
const salaId = ref("");

async function carregarSalas() {
  const response = await api.get("/salas");
  salas.value = response.data;
}

async function criarReserva() {
  if (!data.value || !horaInicio.value || !horaFim.value || !salaId.value) {
    Swal.fire("Atenção", "Preencha tudo!", "warning");
    return;
  }

  try {
    await api.post("/reservas", {
      data: data.value,
      horaInicio: horaInicio.value,
      horaFim: horaFim.value,
      usuarioId: localStorage.getItem("id"),
      salaId: salaId.value,
    });

    Swal.fire("Sucesso!", "Reserva criada (aguardando aprovação)!", "success");

    data.value = "";
    horaInicio.value = "";
    horaFim.value = "";
    salaId.value = "";
  } catch (error) {
    Swal.fire("Erro!", error.response?.data?.message || "Erro ao criar reserva", "error");
  }
}

onMounted(() => {
  carregarSalas();
});
</script>

<template>
  <div class="card">
    <h2 class="title">Nova Reserva</h2>

    <div style="display: grid; gap: 10px">
      <label><b>Data</b></label>
      <input class="input" type="date" v-model="data" />

      <label><b>Horário</b></label>
      <div style="display: flex; gap: 10px">
        <input class="input" type="time" v-model="horaInicio" />
        <input class="input" type="time" v-model="horaFim" />
      </div>

      <label><b>Sala</b></label>
      <select class="input" v-model="salaId">
        <option value="">Selecione</option>
        <option v-for="s in salas" :key="s.id" :value="s.id">
          {{ s.nome }}
        </option>
      </select>

      <button class="btn btn-blue" @click="criarReserva">
        Solicitar Reserva
      </button>
    </div>
  </div>
</template>