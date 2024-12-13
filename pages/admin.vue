<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white p-8 rounded shadow-md w-96">
            <h1 class="text-2xl font-bold mb-4 admin text-black">Welcome to Admin Page</h1>
            <p class="mb-4 text-red-500">Only accessible by admin users.</p>
            <NuxtLink to="/home" class="w-full bg-blue-500 text-white p-2 rounded block text-center">
                Back to Home
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
// Tentukan middleware untuk halaman ini
definePageMeta({
    middleware: 'auth',
});
</script>
