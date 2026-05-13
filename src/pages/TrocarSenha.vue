<script setup>
import { ref } from "vue";
import api from "../api/api";
import Swal from "sweetalert2";

const senhaAtual = ref("");
const novaSenha = ref("");

async function trocarSenha() {
  try {
    await api.put("/auth/trocar-senha", {
      senhaAtual: senhaAtual.value,
      novaSenha: novaSenha.value,
    });

    Swal.fire("Sucesso!", "Senha alterada!", "success");

    senhaAtual.value = "";
    novaSenha.value = "";
  } catch (error) {
    Swal.fire("Erro!", error.response?.data?.message || "Erro ao trocar senha", "error");
  }
}
</script>

<template>
  <div class="card">
    <h2>Trocar Senha</h2>

    <input v-model="senhaAtual" placeholder="Senha atual" type="password" />
    <input v-model="novaSenha" placeholder="Nova senha" type="password" />

    <button @click="trocarSenha">Alterar</button>
  </div>
</template>

<style scoped>
.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  max-width: 450px;
  margin: auto;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

button {
  width: 100%;
  padding: 10px;
  background: orange;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
</style>