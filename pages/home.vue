<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white p-8 rounded shadow-md w-96">
            <h1 class="text-2xl font-bold mb-4 text-black">Welcome to Home</h1>
            <p class="mb-4 text-black">You are logged in as: <strong class="text-red-500">{{ role }}</strong></p>

            <!-- Tautan ke halaman Admin hanya untuk admin -->
            <div v-if="role === 'admin'" class="mb-4">
                <NuxtLink to="/admin" class="w-full bg-blue-500 text-white p-2 rounded block text-center">
                    Go to Admin Page
                </NuxtLink>
            </div>

            <!-- Tombol Logout -->
            <button @click="logout" class="w-full bg-red-500 text-white p-2 rounded">
                Logout
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useState } from '#app';
import { navigateTo } from 'nuxt/app';

// Tentukan middleware untuk halaman ini
definePageMeta({
    middleware: 'auth',
});

// Ambil informasi pengguna dari state
const user = useState<{ role: string } | null>('user', () => null);
const role = user.value?.role || '';

// Fungsi logout
const logout = async () => {
    try {
        const response = await $fetch<{ success: boolean; message: string }>('/api/auth/logout', {
            method: 'POST',
        });

        if (response.success) {
            // Hapus data sesi dari localStorage hanya di sisi klien
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
            }
            user.value = null; // Reset state pengguna
            navigateTo('/login'); // Redirect ke halaman login
        } else {
            console.error('Logout failed:', response.message);
        }
    } catch (err) {
        console.error('Error logging out:', err);
    }
};
</script>
