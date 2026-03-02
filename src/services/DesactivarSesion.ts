import auth from "../Auth/auth";

const API_URL = "/session/deactivate";

export const deactivateSession = async (token: string): Promise<any> => {
    try {
        const response = await auth.post(
            API_URL,
            null,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Deactivate Session API error:", error);
        throw new Error("Error al desactivar sesión");
    }
}