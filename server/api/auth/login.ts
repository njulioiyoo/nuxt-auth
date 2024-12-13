import { defineEventHandler, readBody, createError } from "h3";
import { registeredUsers, User } from "@/server/repositories/user";

// Fungsi validasi input
const validateCredentials = (username: string, password: string) => {
  if (username.length < 4) {
    throw createError({
      statusCode: 400,
      statusMessage: "Username must be at least 4 characters",
      data: { field: "username" },
    });
  }
  if (password.length < 4) {
    throw createError({
      statusCode: 400,
      statusMessage: "Password must be at least 4 characters",
      data: { field: "password" },
    });
  }
};

// Fungsi untuk login
export default defineEventHandler(async (event) => {
  try {
    // Baca body dari permintaan
    const { username, password } = await readBody(event);

    // Validasi input
    validateCredentials(username, password);

    // Cek kredensial terhadap data pengguna terdaftar
    const user: User | undefined = registeredUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid username or password",
      });
    }

    // Jika validasi berhasil, kembalikan data pengguna
    return { message: "Login successful", role: user.role };
  } catch (err: any) {
    return {
      statusCode: err.statusCode || 500,
      message: err.statusMessage || "An error occurred",
    };
  }
});
