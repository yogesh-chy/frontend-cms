import { api } from "./api";

export const userService = {
  async getUsers(): Promise<any> {
    return api.fetchGet<any>("/api/users");
  },

  async approveUser(id: number | string): Promise<any> {
    return api.fetchPost<any>(`/api/users?id=${id}&action=approve`);
  },

  async deleteUser(id: number | string): Promise<any> {
    return api.fetchDelete<any>(`/api/users?id=${id}`);
  },
};
