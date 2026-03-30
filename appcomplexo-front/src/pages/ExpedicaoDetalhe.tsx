import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { getEventos } from "../api/eventoApi"
import type { Evento } from "../types/Evento"

export default function ExpedicaoDetalhe() {
  const { id } = useParams()
  //const {nome} = useParams()
  const [eventos, setEventos] = useState<Evento[]>([])

  useEffect(() => {
    const carregarEventos = async () => {
      const resultado = await getEventos()
      if (Array.isArray(resultado)) {
        // Filtro que aceita exID ou expedicao_id (o que vier do Go)
        const filtrados = resultado
          .filter(ev => ev.expedicaoId === Number(id))
          .sort((a, b) => b.data.getTime() - a.data.getTime())
        setEventos(filtrados)
      }
    }
    carregarEventos()
  }, [id])

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      <main className="max-w-6xl mx-auto px-6 pb-20">

        {/* HEADER */}
        <section className="mb-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            ⚓ Expedição #{id}
          </h1>
          <p className="text-slate-500">
            Centro de controle da expedição.
          </p>
        </section>


        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* EVENTOS */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="h-2 bg-indigo-500"></div>
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                📜 Eventos da Expedição
              </h2>

              {eventos.length > 0 ? (
                <div className="space-y-4">
                  {eventos.map(ev => (
                    <div key={ev.id} className="border-b border-slate-100 pb-3 last:border-0">
                      <p className="font-medium text-slate-700">{ev.descricao}</p>
                      <p className="text-xs text-slate-400">📅 {ev.data.toLocaleDateString("pt-BR")}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm italic">
                  Nenhum evento registrado no logbook desta expedição.
                </p>
              )}
            </div>
          </div>


          {/* TRIPULAÇÃO */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="h-2 bg-indigo-500"></div>
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                👨‍✈️ Tripulação
              </h2>
              <p className="text-slate-500 text-sm">
                Aqui aparecerão os tripulantes da expedição.
              </p>
            </div>
          </div>

        </div>

      </main>

    </div>
  )
}