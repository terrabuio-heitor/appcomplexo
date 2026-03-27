import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { View, Text, FlatList } from "react-native"
import { getEventos } from "../../src/api/eventoApi"
import type { Evento } from "../../src/types/Evento"

export default function DetalheExpedicao() {
  const { id } = useLocalSearchParams()
  const [eventos, setEventos] = useState<Evento[]>([])

  useEffect(() => {
    const carregar = async () => {
      const res = await getEventos()

      if (Array.isArray(res)) {
        const filtrados = res.filter(ev => {
          const ex = ev.exID || (ev as any).expedicao_id
          return Number(ex) === Number(id)
        })

        setEventos(filtrados)
      }
    }

    carregar()
  }, [id])

  return (
    <View style={{ flex: 1, padding: 16 }}>

      {/* HEADER */}
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        ⚓ Expedição #{id}
      </Text>

      <Text style={{ color: "#555", marginBottom: 20 }}>
        Central de comando da missão
      </Text>

      {/* EVENTOS */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        📜 Eventos
      </Text>

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              padding: 14,
              borderRadius: 12,
              marginBottom: 10,
              elevation: 2
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {item.tipo}
            </Text>

            <Text style={{ color: "#555" }}>
              {item.descricao}
            </Text>

            <Text style={{ fontSize: 12, color: "#999" }}>
              📅 {String(item.data)}
            </Text>
          </View>
        )}
      />

      {eventos.length === 0 && (
        <Text style={{ color: "#999" }}>
          Nenhum evento registrado ⚠️
        </Text>
      )}

    </View>
  )
}