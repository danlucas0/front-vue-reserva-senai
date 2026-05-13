<script setup>
import { ref } from "vue";
import api from "../api/api";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const router = useRouter();

const senhaAtual = ref("");
const novaSenha = ref("");

async function trocarSenha() {
  if (!senhaAtual.value || !novaSenha.value) {
    Swal.fire("Atenção", "Preencha tudo!", "warning");
    return;
  }

  try {
    await api.put("/auth/trocar-senha", {
      senhaAtual: senhaAtual.value,
      novaSenha: novaSenha.value,
    });

    Swal.fire("Sucesso!", "Senha alterada com sucesso!", "success");

    senhaAtual.value = "";
    novaSenha.value = "";

    router.push("/login");
  } catch (error) {
    Swal.fire(
      "Erro!",
      error.response?.data?.message || "Erro ao trocar senha",
      "error"
    );
  }
}
</script>

<template>
  <div class="card" style="max-width: 420px; margin: 50px auto;">
    <h2 class="title">Trocar Senha</h2>

    <div style="display: grid; gap: 10px">
      <input
        class="input"
        type="password"
        v-model="senhaAtual"
        placeholder="Senha atual..."
      />

      <input
        class="input"
        type="password"
        v-model="novaSenha"
        placeholder="Nova senha..."
      />

      <button class="btn btn-blue" @click="trocarSenha">
        Trocar Senha
      </button>
    </div>
  </div>
</template>