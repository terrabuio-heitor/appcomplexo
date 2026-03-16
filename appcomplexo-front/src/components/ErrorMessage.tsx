import type { AppError } from "../utils/errorHandler"

export default function ErrorMessage({ error, onRetry }: { error: AppError, onRetry?: () => void }) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded-r-xl shadow-sm animate-pulse">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-red-800 font-bold flex items-center gap-2">
            ⚠️ Erro {error.codigo && `[${error.codigo}]`}
          </p>
          <p className="text-red-600 text-sm">{error.mensagem}</p>
        </div>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-red-700"
          >
            Tentar Novamente
          </button>
        )}
      </div>
    </div>
  )
}