package main

import (
	"application-complexa/internal/handlers"
	"application-complexa/internal/repository"
	"application-complexa/internal/services"
	"application-complexa/sql"
	"log"
	"net/http"
	// Importa onde está o db.go
)

func main() {
	// 1. Liga o banco de dados
	sql.Connect()
	db := sql.Conectar()

	//Expedição
	repoEx := repository.NovaExpedicaoRepository(db)
	serviceEx := services.NovoServicoEX(repoEx)
	handlerEx := handlers.NovoExpedicaoHandler(serviceEx)
	//Eventos
	repoEv := repository.NovaEventoRepository(db)
	serviceEv := services.NovoServicoEV(repoEv)
	handlerEv := handlers.NovaEventoHandler(serviceEv)

	// 2. Define a rota e aponta para o handler
	//http.HandleFunc("/expedicao/", handlers.ExpedicaoHandler)
	http.Handle("/expedicao", handlerEx)
	http.Handle("/expedicao/", handlerEx)

	http.Handle("/eventos", handlerEv)
	http.Handle("/eventos/", handlerEv)
	// http.HandleFunc("/eventos/", handlers.EventosHandler)
	// http.HandleFunc("/tripulantes/", handlers.TripulacaoHandler)

	log.Println("🚢 Navio ancorado na porta :8080")
	http.ListenAndServe(":8080", nil)
}
