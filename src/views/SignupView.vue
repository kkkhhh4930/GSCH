<template>
  <h1>회원가입 페이지</h1>
  <div>
    <form @submit.prevent="signup">
      <label for="username">Username: </label>
      <input type="text" id="username" v-model="username" /><br />
      <label for="name">Name: </label>
      <input type="text" id="name" v-model="name" /><br />
      <label for="email">Email: </label>
      <input type="email" id="email" v-model="email" /><br />
      <label for="password1">Password: </label>
      <input type="password" id="password1" v-model="password1" /><br />
      <label for="password2">Password Confirmation: </label>
      <input type="password" id="password2" v-model="password2" /><br />
      <input type="submit" value="Sign Up" />
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useArticleStore } from "@/stores/articles";
const store = useArticleStore();
const username = ref("");
const name = ref("");
const email = ref("");
const password1 = ref("");
const password2 = ref("");

const signup = function () {
  const info = {
    username: username.value,
    name: name.value,
    email: email.value,
    password1: password1.value,
    password2: password2.value,
  };
  store.signup(info);
};
</script>

<style scoped></style>
