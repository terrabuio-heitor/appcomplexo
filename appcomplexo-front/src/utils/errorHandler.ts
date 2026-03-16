export interface AppError {
  mensagem: string;
  codigo?: number | string;
}

export const handleApiError = async (response: Response): Promise<AppError> => {
  let detalhe;
  try {
    detalhe = await response.json();
  } catch {
    detalhe = null;
  }

  return {
    mensagem: detalhe?.message || response.statusText || "Erro desconhecido na comunicação.",
    codigo: response.status
  };
};

export const handleNetworkError = (error: any): AppError => {
  console.error("Erro Crítico:", error);
  return {
    mensagem: "Não foi possível conectar ao servidor. Verifique sua conexão ou o status do Tailscale.",
    codigo: "OFFLINE"
  };
};