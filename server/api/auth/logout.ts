// server/api/auth/logout.ts
import { defineEventHandler } from "h3";

export default defineEventHandler((event) => {
  // Reset context pengguna (jika ada mekanisme sesi atau token)
  event.context.user = null;

  return {
    success: true,
    message: "Logged out successfully",
  };
});
