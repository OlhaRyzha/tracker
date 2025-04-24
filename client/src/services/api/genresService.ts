import apiClient from "../BaseService";

const Genres = {
  getAll: () => apiClient.get<string[]>('/api/genres'),
};

export default Genres