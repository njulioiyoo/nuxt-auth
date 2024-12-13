<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
            <h1 class="text-2xl font-bold text-center mb-6 text-blue-600">Login</h1>

            <form @submit.prevent="onSubmit">
                <!-- Username Input -->
                <div class="mb-4">
                    <label for="username" class="block text-sm font-medium text-gray-900">Username</label>
                    <input v-model="form.username" id="username" type="text" placeholder="Enter your username"
                        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :class="{ 'border-red-500': errors.username }" />
                    <p v-if="errors.username" class="text-sm text-red-500 mt-1">{{ errors.username }}</p>
                </div>

                <!-- Password Input -->
                <div class="mb-6">
                    <label for="password" class="block text-sm font-medium text-gray-900">Password</label>
                    <input v-model="form.password" id="password" type="password" placeholder="Enter your password"
                        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :class="{ 'border-red-500': errors.password }" />
                    <p v-if="errors.password" class="text-sm text-red-500 mt-1">{{ errors.password }}</p>
                </div>

                <!-- Submit Button -->
                <button type="submit"
                    class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
                    Login
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { navigateTo } from 'nuxt/app';
import { z } from 'zod';

// Skema validasi login dengan Zod (sama seperti di backend)
const loginSchema = z.object({
    username: z.string().min(4, "Username must be at least 4 characters"),
    password: z.string().min(4, "Password must be at least 4 characters"),
});

// Form dan state error
const form = reactive({
    username: '',
    password: '',
});

const errors = reactive({
    username: '',
    password: '',
});

// Fungsi untuk menangani submit
const onSubmit = async () => {
    try {
        // Reset error state
        errors.username = '';
        errors.password = '';

        // Validasi menggunakan Zod
        loginSchema.parse(form); // Akan lempar error jika tidak valid

        console.log('Sending data to API:', form); // Debug log

        const response = await $fetch<{ role: string }>('/api/auth/login', {
            method: 'POST',
            body: { ...form },
        }).catch((error) => {
            // Jika API gagal, tampilkan pesan error
            const errorMessage = error?.data?.error || 'Invalid username or password';
            throw new Error(errorMessage);
        });

        if (!response.role) {
            throw new Error('Invalid response from server');
        }

        // Simpan informasi pengguna ke localStorage hanya di sisi klien
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify({ role: response.role }));
        }

        // Simpan ke state global
        const user = useState<{ role: string } | null>('user', () => null);
        user.value = { role: response.role };

        // Redirect ke halaman home
        navigateTo('/home');
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            err.errors.forEach((e) => {
                if (e.path && e.path[0] in errors) {
                    errors[e.path[0] as keyof typeof errors] = e.message || '';
                }
            });
        } else {
            console.error('Login failed:', err.message);
            alert(err.message || 'Invalid username or password');
        }
    }
};

</script>
