<script lang="ts" setup>
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

let username = "";
let nickname = "";

function handleCreateUser() {
  userStore.registerUser(username, nickname);
}
</script>

<template>
  <div class="flex flex-col items-center justify-evenly w-full h-full">
    <div>
      <UFormGroup label="Username" required>
        <UInput
          placeholder="Username"
          size="xl"
          icon="i-heroicons-user"
          v-model="username"
        />
      </UFormGroup>
      <UFormGroup class="mt-4" label="Nickname">
        <UInput
          placeholder="Nickname"
          size="xl"
          icon="i-heroicons-user"
          v-model="nickname"
        />
      </UFormGroup>
      <UButton
        class="mt-8"
        @click="handleCreateUser"
        to="/"
        icon="i-heroicons-chevron-right"
        size="xl"
        color="primary"
        variant="outline"
        label="Save  &  Continue"
        trailing
        block
      />
    </div>
  </div>
</template>
