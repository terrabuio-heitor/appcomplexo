package handlers

import (
	//"internal/models"
	"application-complexa/internal/models"
	"application-complexa/sql"
	"encoding/json"
	"net/http"
)

func TripulacaoHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	switch r.Method {
	case http.MethodGet:
		GetTripulante(w, r)
	case http.MethodPost:
		PostTripulante(w, r)
	default:
		http.Error(w, "Metodo não permitido", http.StatusNotAcceptable)
	}
}

//Funções

func GetTripulante(w http.ResponseWriter, r *http.Request) {
	lista, err := models.ListagemTripulantes(sql.DB)
	if err != nil {
		http.Error(w, "Erro ao buscar os tripulantes: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(lista)
}

func PostTripulante(w http.ResponseWriter, r *http.Request) {
	var novoMarujo models.Tripulante
	if err := json.NewDecoder(r.Body).Decode(&novoMarujo); err != nil {
		http.Error(w, "JSON Inválido!!!", http.StatusBadRequest)
		return
	}

	if err := novoMarujo.Valida(); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	//se passou pelas 2 verificações

	resultado := models.CriarTripulante(novoMarujo.Nome, novoMarujo.Cargo, novoMarujo.Experiencia, novoMarujo.ExpedicaoID)
	err := resultado.SalvarNoBanco(sql.DB)
	if err != nil {
		http.Error(w, "Erro ao salvar no banco: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resultado)
}
