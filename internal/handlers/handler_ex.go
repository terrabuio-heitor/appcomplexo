package handlers

import (
	"application-complexa/internal/models"
	"encoding/json"

	"application-complexa/sql"
	//"internal/models"
	"net/http"
)

func ExpedicaoHandler(w http.ResponseWriter, r *http.Request) {
	habilitarCORS(w)
	if r.Method == http.MethodPost {
		var nova models.Expedicao
		if err := json.NewDecoder(r.Body).Decode(&nova); err != nil {
			http.Error(w, "JSON Inválido!!!", http.StatusBadRequest)
			return
		}

		if err := nova.Valida(); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		//se passou pelas 2 verificações

		resultado := models.CriarEx(nova.Nome, nova.Navio, nova.Capitao, nova.Data_inicio)

		err := resultado.SalvarNoBanco(sql.DB)
		if err != nil {
			http.Error(w, "Erro ao salvar no banco: "+err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resultado)
	}
	if r.Method == http.MethodGet {
		lista, err := models.ListagemGeral(sql.DB)
		if err != nil {
			http.Error(w, "Erro ao buscar as expedições: "+err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(lista)
		return
	}
}

func habilitarCORS(w http.ResponseWriter) {
	//w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5500")
	w.Header().Set("Access-Control-Allow-Origin", "*") //Perigo
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
