import { useEffect, useState } from "react"
import { getTripulantes, criarTripulante, deletarTripulante } from "../api/tripulantesApi"
import type { Tripulante } from "../types/Tripulantes"
import TripulanteForm from "../components/TripulantesForm"
import ErrorMessage from "../components/ErrorMessage"
import type { AppError } from "../utils/errorHandler"

export default function Tripulantes() {
  const [tripulantes, setTripulantes] = useState<Tripulante[]>([])
  const [erro, setErro] = useState<AppError | null>(null)

  const carregar = async () => {
    setErro(null)
    const resultado = await getTripulantes()
    
    // Filtro contra o backend retornar nulo ao invés de vazio
    if (resultado && typeof resultado === 'object' && "mensagem" in resultado) {
      setErro(resultado as AppError)
    } else {
      // DEFESA ABSOLUTA
      setTripulantes(Array.isArray(resultado) ? resultado : [])
    }
  }
  
  useEffect(() => { 
    carregar() 
  }, [])

  const adicionar = async (trip: Tripulante) => {
    setErro(null)
    const resultado = await criarTripulante(trip)
    
    if (resultado && typeof resultado === 'object' && "mensagem" in resultado) {
      setErro(resultado as AppError)
    } else {
      carregar()
    }
  }

  const remover = async (id: number) => {
    setErro(null)
    const resultado = await deletarTripulante(id)
    
    if (resultado && typeof resultado === 'object' && "mensagem" in resultado) {
      setErro(resultado as AppError)
    } else {
      carregar()
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-800">Manifesto da Tripulação</h1>
        <p className="text-slate-500">Gerencie os homens e mulheres que enfrentarão os mares.</p>
      </header>

      <section className="mb-6">
        <TripulanteForm onSave={adicionar} />
      </section>

      {/* Painel de Erro */}
      {erro && <ErrorMessage error={erro} onRetry={carregar} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {tripulantes.map(t => (
          <div key={t.id} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-300 transition-all">
            <div>
              <p className="font-bold text-slate-800">{t.nome}</p>
              <p className="text-xs text-indigo-600 font-medium uppercase tracking-wider">{t.cargo}</p>
            </div>
            <button 
              onClick={() => t.id && remover(t.id)}
              className="text-slate-300 hover:text-red-500 transition-colors"
              title="Dispensar Marujo"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        ))}
      </div>

      {tripulantes.length === 0 && !erro && (
        <div className="text-center py-16 mt-8 border-2 border-dashed border-slate-200 rounded-2xl">
          <p className="text-slate-400">
            Nenhum marujo alistado. A taberna está vazia.
          </p>
        </div>
      )}
    </main>
  )
}