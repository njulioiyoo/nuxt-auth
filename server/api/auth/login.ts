import { defineEventHandler, readBody } from "h3";

// Daftar pengguna yang terdaftar di server
const registeredUsers = [
  { username: "admin", password: "admin", role: "admin" },
  { username: "employee", password: "employee", role: "employee" },
];

// Fungsi untuk login
export default defineEventHandler(async (event) => {
  try {
    // Baca body dari permintaan
    const body = await readBody(event);

    // Validasi input secara manual
    const { username, password } = body;

    if (!username || username.length < 4) {
      throw createError({
        statusCode: 400,
        statusMessage: "Username must be at least 4 characters",
      });
    }

    if (!password || password.length < 4) {
      throw createError({
        statusCode: 400,
        statusMessage: "Password must be at least 4 characters",
      });
    }

    // Cek kredensial terhadap data pengguna terdaftar
    const user = registeredUsers.find(
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
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      message: err.statusMessage || "An error occurred",
    };
  }
});
