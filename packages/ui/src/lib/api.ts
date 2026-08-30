const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

function imageUrl(path: string | null | undefined): string {
  if (!path) return ""
  if (path.startsWith("http")) return path
  return `${API_URL.replace("/api", "")}${path}`
}

function getToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

function setToken(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem("token", token)
}

function removeToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem("token")
}

function getBusinessId() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("businessId")
}

function setBusinessId(id: string) {
  if (typeof window === "undefined") return
  localStorage.setItem("businessId", id)
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers as Record<string, string>,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const businessId = getBusinessId()
  if (businessId && !path.startsWith("/booking") && !path.startsWith("/auth")) {
    headers["x-business-id"] = businessId
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong")
  }

  return data
}

export const api = {
  // Auth
  signup: (body: { fullName: string; email: string; password: string; businessName: string; businessType?: string }) =>
    request("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),

  // Business
  getBusiness: (businessId: string) => request(`/business/${businessId}`),
  updateBusiness: (businessId: string, body: Record<string, unknown>) =>
    request(`/business/${businessId}`, { method: "PUT", body: JSON.stringify(body) }),
  getDashboard: (businessId: string) => request(`/business/${businessId}/dashboard`),
  getAnalytics: (businessId: string) => request(`/business/${businessId}/analytics`),
  getWorkingHours: (businessId: string) => request(`/business/${businessId}/working-hours`),
  setWorkingHours: (businessId: string, body: Record<string, unknown>) =>
    request(`/business/${businessId}/working-hours`, { method: "POST", body: JSON.stringify(body) }),

  // Services
  getServices: (businessId: string) => request(`/services/${businessId}`),
  createService: (businessId: string, body: Record<string, unknown>) =>
    request(`/services/${businessId}`, { method: "POST", body: JSON.stringify(body) }),
  updateService: (businessId: string, id: string, body: Record<string, unknown>) =>
    request(`/services/${businessId}/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteService: (businessId: string, id: string) =>
    request(`/services/${businessId}/${id}`, { method: "DELETE" }),

  // Staff
  getStaff: (businessId: string) => request(`/staff/${businessId}`),
  createStaff: (businessId: string, body: Record<string, unknown>) =>
    request(`/staff/${businessId}`, { method: "POST", body: JSON.stringify(body) }),
  updateStaff: (businessId: string, id: string, body: Record<string, unknown>) =>
    request(`/staff/${businessId}/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteStaff: (businessId: string, id: string) =>
    request(`/staff/${businessId}/${id}`, { method: "DELETE" }),

  // Appointments
  getAppointments: (businessId: string, params?: { date?: string; from?: string; to?: string; staffId?: string }) => {
    const query = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : ""
    return request(`/appointments/${businessId}${query}`)
  },
  createAppointment: (businessId: string, body: Record<string, unknown>) =>
    request(`/appointments/${businessId}`, { method: "POST", body: JSON.stringify(body) }),
  updateAppointmentStatus: (businessId: string, id: string, status: string) =>
    request(`/appointments/${businessId}/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  rescheduleAppointment: (businessId: string, id: string, body: Record<string, unknown>) =>
    request(`/appointments/${businessId}/${id}/reschedule`, { method: "PUT", body: JSON.stringify(body) }),
  getAvailableSlots: (businessId: string, params: { staffId: string; date: string; serviceId: string }) =>
    request(`/appointments/${businessId}/available-slots?${new URLSearchParams(params)}`),

  // Customers
  getCustomers: (businessId: string, search?: string) =>
    request(`/customers/${businessId}${search ? `?search=${search}` : ""}`),
  getCustomer: (businessId: string, id: string) => request(`/customers/${businessId}/${id}`),
  createCustomer: (businessId: string, body: Record<string, unknown>) =>
    request(`/customers/${businessId}`, { method: "POST", body: JSON.stringify(body) }),
  updateCustomer: (businessId: string, id: string, body: Record<string, unknown>) =>
    request(`/customers/${businessId}/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  // Public booking
  getBookingInfo: (slug: string) => request(`/booking/${slug}`),
  getBookingSlots: (slug: string, params: { serviceId: string; staffId: string; date: string }) =>
    request(`/booking/${slug}/slots?${new URLSearchParams(params)}`),
  createBooking: (slug: string, body: Record<string, unknown>) =>
    request(`/booking/${slug}`, { method: "POST", body: JSON.stringify(body) }),

  // Public profile
  getPublicProfile: (slug: string) => request(`/public/${slug}`),
  getPublicServices: (slug: string) => request(`/public/${slug}/services`),
  submitReview: (slug: string, body: Record<string, unknown>) =>
    request(`/public/${slug}/reviews`, { method: "POST", body: JSON.stringify(body) }),

  // SEO & Booking Settings
  updateSEO: (businessId: string, body: Record<string, unknown>) =>
    request(`/business/${businessId}/seo`, { method: "PUT", body: JSON.stringify(body) }),
  updateBookingSettings: (businessId: string, body: Record<string, unknown>) =>
    request(`/business/${businessId}/booking-settings`, { method: "PUT", body: JSON.stringify(body) }),

  // Events
  getEvents: (businessId: string) => request(`/events/${businessId}`),
  getEvent: (businessId: string, eventId: string) => request(`/events/${businessId}/${eventId}`),
  createEvent: (businessId: string, body: Record<string, unknown>) =>
    request(`/events/${businessId}`, { method: "POST", body: JSON.stringify(body) }),
  updateEvent: (businessId: string, eventId: string, body: Record<string, unknown>) =>
    request(`/events/${businessId}/${eventId}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteEvent: (businessId: string, eventId: string) =>
    request(`/events/${businessId}/${eventId}`, { method: "DELETE" }),
  updateRegistrationStatus: (businessId: string, eventId: string, regId: string, status: string) =>
    request(`/events/${businessId}/${eventId}/registration/${regId}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  checkinRegistration: (businessId: string, eventId: string, regId: string) =>
    request(`/events/${businessId}/${eventId}/registration/${regId}/checkin`, { method: "PUT" }),

  // Payments
  getTransactions: (businessId: string, params?: { status?: string; from?: string; to?: string }) => {
    const query = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : ""
    return request(`/payments/${businessId}/transactions${query}`)
  },
  recordPayment: (businessId: string, body: Record<string, unknown>) =>
    request(`/payments/${businessId}/transactions`, { method: "POST", body: JSON.stringify(body) }),
  updateTransactionStatus: (businessId: string, id: string, status: string) =>
    request(`/payments/${businessId}/transactions/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  getPlans: () => request(`/payments/plans`),
  getSubscription: (businessId: string) => request(`/payments/${businessId}/subscription`),

  // AI Assistant
  getInsights: (businessId: string) => request(`/ai/${businessId}/insights`),
  aiChat: (businessId: string, message: string) =>
    request(`/ai/${businessId}/chat`, { method: "POST", body: JSON.stringify({ message }) }),

  // Uploads
  uploadImage: async (file: File) => {
    const token = getToken()
    const formData = new FormData()
    formData.append("image", file)
    const headers: Record<string, string> = {}
    if (token) headers["Authorization"] = `Bearer ${token}`
    // Do NOT set Content-Type — browser will set multipart/form-data with boundary automatically
    const res = await fetch(`${API_URL}/uploads/image`, {
      method: "POST",
      headers,
      body: formData,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Upload failed")
    return data as { url: string; filename: string }
  },

  // Token management
  setToken,
  removeToken,
  getToken,
  setBusinessId,
  getBusinessId,
  imageUrl,
}
