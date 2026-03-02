import auth from "../Auth/auth";

const API_URL = "/session/status";

export const verifySS_Status = async (token: string): Promise<any> => {
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

        return response;
    } catch (error) {
        console.error("Status Session API error:", error);
        // throw new Error("Error al validar estado de la sesión");
    }
} 