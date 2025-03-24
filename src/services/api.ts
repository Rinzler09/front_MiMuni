import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/v1",
   
    //Permite que las cookies se envíen en las solicitudes
    withCredentials: true,
});

export default api;