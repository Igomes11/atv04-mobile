import axios from 'axios';

const api = axios.create({
  // Lembre-se: para testar no celular físico ou emulador, troque pelo seu IP local (ex: 192.168.0.10)
  baseURL: '10.31.89.194:3000', 
});

export default api;