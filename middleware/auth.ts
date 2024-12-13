export default defineNuxtRouteMiddleware((to, from) => {
  console.log("Middleware executed:", { path: to.path });

  let user = useState<{ role: string } | null>("user", () => null);

  // Cek jika user tidak ada di state, coba ambil dari localStorage (hanya di sisi klien)
  if (!user.value && typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }
  }

  // Jika pengguna belum login, arahkan ke halaman login
  if (!user.value || !user.value.role) {
    console.log("User not logged in");
    return navigateTo("/login");
  }

  // Jika pengguna login tetapi mencoba mengakses halaman admin tanpa izin
  if (to.path === "/admin" && user.value.role !== "admin") {
    console.log("Access denied for user:", user.value); // Log jika akses ditolak

    // Arahkan ke halaman home
    return navigateTo("/home");
  }
});
