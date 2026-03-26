import axios from 'axios';

// ── Base axios instance ──────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const isPublicAuthCall = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
  const token = localStorage.getItem('token');
  if (token && !isPublicAuthCall) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// // ── MOCK AUTH (no backend needed) ───────────────────────────────
// // Remove this block and uncomment the real authApi below once your backend is ready.
// const DEMO_USERS = [
//   { id: 1, name: 'Admin User',  email: 'admin@city.gov',   password: 'admin',   role: 'ADMIN'   },
//   { id: 2, name: 'Jane Doe',    email: 'jane@example.com', password: 'citizen', role: 'CITIZEN' },
// ];

// const fakeDelay = (ms = 400) => new Promise(r => setTimeout(r, ms));

// export const authApi = {
//   login: async ({ email, password }) => {
//     await fakeDelay();
//     const user = DEMO_USERS.find(u => u.email === email && u.password === password);
//     if (!user) throw { response: { data: { message: 'Invalid email or password' } } };
//     const { password: _, ...safeUser } = user;
//     return { data: { token: 'mock-jwt-token', user: safeUser } };
//   },
//   register: async (data) => {
//     await fakeDelay();
//     if (DEMO_USERS.find(u => u.email === data.email))
//       throw { response: { data: { message: 'Email already in use' } } };
//     const newUser = { id: Date.now(), name: data.name, email: data.email, role: 'CITIZEN' };
//     DEMO_USERS.push({ ...newUser, password: data.password });
//     return { data: { token: 'mock-jwt-token', user: newUser } };
//   },
//   me:     async () => { await fakeDelay(); return { data: null }; },
//   logout: async () => { await fakeDelay(); return { data: {} }; },
// };

// ── USER MODULE  (/api/users, /api/auth) ─────────────────────────
// Uncomment below and remove the MOCK block above when backend is ready:
export const authApi = {
  login:    (credentials)  => api.post('/auth/login', credentials),
  register: (data)         => api.post('/auth/register', data),
  me:       ()             => api.get('/auth/me'),
  logout:   ()             => api.post('/auth/logout'),
};

export const userApi = {
  getAll:   (params)       => api.get('/users', { params }),
  getById:  (id)           => api.get(`/users/${id}`),
  create:   (data)         => api.post('/users', data),
  update:   (id, data)     => api.put(`/users/${id}`, data),
  delete:   (id)           => api.delete(`/users/${id}`),
  assignRole: (id, role)   => api.patch(`/users/${id}/role`, { role }),
};

// ── PARKING MANAGEMENT MODULE  (/api/zones, /api/spaces) ─────────
export const zoneApi = {
  getAll:   (params)       => api.get('/zones', { params }),
  getById:  (id)           => api.get(`/zones/${id}`),
  create:   (data)         => api.post('/zones', data),
  update:   (id, data)     => api.put(`/zones/${id}`, data),
  delete:   (id)           => api.delete(`/zones/${id}`),
  getSpaces:(id)           => api.get(`/zones/${id}/spaces`),
};

export const spaceApi = {
  getAll:   (params)       => api.get('/spaces', { params }),
  getById:  (id)           => api.get(`/spaces/${id}`),
  create:   (data)         => api.post('/spaces', data),
  update:   (id, data)     => api.put(`/spaces/${id}`, data),
  delete:   (id)           => api.delete(`/spaces/${id}`),
  search:   (params)       => api.get('/spaces/search', { params }),
  getAvailable: (params)   => api.get('/spaces/available', { params }),
};

export const pricingApi = {
  getAll:   ()             => api.get('/pricing'),
  getByZone:(zoneId)       => api.get(`/pricing/zone/${zoneId}`),
  create:   (data)         => api.post('/pricing', data),
  update:   (id, data)     => api.put(`/pricing/${id}`, data),
  delete:   (id)           => api.delete(`/pricing/${id}`),
};

// ── RESERVATION MODULE  (/api/reservations) ──────────────────────
export const reservationApi = {
  getAll:    (params)      => api.get('/reservations', { params }),
  getById:   (id)          => api.get(`/reservations/${id}`),
  getMine:   ()            => api.get('/reservations/my'),
  create:    (data)        => api.post('/reservations', data),
  cancel:    (id)          => api.patch(`/reservations/${id}/cancel`),
  finish:    (id)          => api.patch(`/reservations/${id}/finish`),
  checkIn:   (id)          => api.patch(`/reservations/${id}/checkin`),
};

// ── BILLING MODULE  (/api/billing, /api/invoices, /api/payments) ──
export const billingApi = {
  getMyInvoices:    ()        => api.get('/billing/invoices/my'),
  getAllInvoices:   (params)  => api.get('/billing/invoices', { params }),
  getInvoice:       (id)      => api.get(`/billing/invoices/${id}`),
  payInvoice:       (id, data)=> api.post(`/billing/invoices/${id}/pay`, data),
  getBillingState:  (resId)   => api.get(`/billing/state/${resId}`),
  getStats:         ()        => api.get('/billing/stats'),
};

// ── OCCUPANCY / ANALYTICS  (/api/analytics) ──────────────────────
export const analyticsApi = {
  getOccupancy:   (params)   => api.get('/analytics/occupancy', { params }),
  getZoneSummary: ()         => api.get('/analytics/zones/summary'),
  getRevenueStats:(params)   => api.get('/analytics/revenue', { params }),
};

export default api;
