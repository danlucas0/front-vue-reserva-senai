<script setup>
import { ref } from "vue";
import api from "../api/api";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

import senaiLogo from "../assets/senai.jpg";

const email = ref("");
const senha = ref("");

const router = useRouter();

async function login() {
  if (!email.value || !senha.value) {
    Swal.fire("Atenção", "Digite email e senha!", "warning");
    return;
  }

  try {
    const response = await api.post("/auth/login", {
      email: email.value,
      senha: senha.value,
    });

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("id", response.data.id);
    localStorage.setItem("nome", response.data.nome);

    Swal.fire("Sucesso!", "Login realizado!", "success");

    if (response.data.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/professor/minhas-reservas");
    }
  } catch (error) {
    Swal.fire(
      "Erro!",
      error.response?.data?.message || "Email ou senha inválidos!",
      "error"
    );
  }
}
</script>

<template>
  <div class="login-container">
    <div class="card">
      <img :src="senaiLogo" alt="Senai Logo" class="logo-img" />

      <h1 class="title">Sistema de Reservas</h1>
      <p class="subtitle">Acesse sua conta para continuar</p>

      <input v-model="email" placeholder="Email" type="email" />
      <input v-model="senha" placeholder="Senha" type="password" />

      <button @click="login">Entrar</button>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f6f9;
  padding: 15px;
}

.card {
  background: white;
  padding: 30px;
  width: 100%;
  max-width: 380px;
  border-radius: 14px;
  box-shadow: 0px 0px 18px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.logo-img {
  width: 140px;
  margin-bottom: 15px;
}

.title {
  font-size: 22px;
  margin-bottom: 5px;
  font-weight: bold;
  color: #0072ce;
}

.subtitle {
  color: gray;
  margin-bottom: 20px;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 11px;
  margin-bottom: 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  outline: none;
  font-size: 14px;
}

input:focus {
  border-color: #0072ce;
}

button {
  width: 100%;
  padding: 11px;
  background: #0072ce;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  font-size: 15px;
}

button:hover {
  background: #005fa8;
}

.logo-img {
  width: 140px;
  margin: 0 auto 15px auto;
  display: block;
}
</style>