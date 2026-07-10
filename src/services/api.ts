import { axiosInstance } from "@/lib/axios";

export const api = {
  // Consumption via Axios
  async get<T>(url: string, params?: any): Promise<T> {
    const res = await axiosInstance.get<T>(url, { params });
    return res.data;
  },

  async post<T>(url: string, body?: any): Promise<T> {
    const res = await axiosInstance.post<T>(url, body);
    return res.data;
  },

  async delete<T>(url: string): Promise<T> {
    const res = await axiosInstance.delete<T>(url);
    return res.data;
  },

  // Consumption via Fetch (Native)
  async fetchGet<T>(url: string): Promise<T> {
    const res = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } });
    return res.json();
  },

  async fetchPost<T>(url: string, body?: any): Promise<T> {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  async fetchDelete<T>(url: string): Promise<T> {
    const res = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  },
};

