// Definisi tipe untuk pengguna
export interface User {
  username: string;
  password: string;
  role: string;
}

// Simulasi data pengguna yang terdaftar di server
export const registeredUsers: User[] = [
  { username: "admin", password: "admin", role: "admin" },
  { username: "employee", password: "employee", role: "employee" },
];
