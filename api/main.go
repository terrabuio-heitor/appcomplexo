package main

import (
	"application-complexa/internal/handlers"
	"application-complexa/sql"
	"log"
	"net/http"
	// Importa onde está o db.go
)

func main() {
	// 1. Liga o banco de dados
	sql.Connect()

	// 2. Define a rota e aponta para o handler
	//http.HandleFunc("/expedicao", handlers.ExpedicaoHandler)
	http.HandleFunc("/expedicao/", handlers.ExpedicaoHandler)
	http.HandleFunc("/eventos/", handlers.EventosHandler)
	http.HandleFunc("/tripulantes/", handlers.TripulacaoHandler)

	log.Println("🚢 Navio ancorado na porta :8080")
	http.ListenAndServe(":8080", nil)
}
