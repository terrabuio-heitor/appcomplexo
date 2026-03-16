package handlers

import (
	"application-complexa/internal/models"
	"encoding/json"
	"strconv"
	"strings"

	"application-complexa/sql"
	//"internal/models"
	"net/http"
)

func habilitarCORS(w http.ResponseWriter) {
	//w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5500")
	w.Header().Set("Access-Control-Allow-Origin", "*") //Perigo
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

}

func ExpedicaoHandler(w http.ResponseWriter, r *http.Request) {
	//habilitarCORS(w)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	// if r.Method == http.MethodOptions {
	// 	w.WriteHeader(http.StatusOK)
	// 	return
	// }

	switch r.Method {
	case http.MethodPost:
		PostExpedicao(w, r)
	case http.MethodGet:
		GetExpedicao(w, r)
	case http.MethodDelete:
		DeleteExpedicao(w, r)
	case http.MethodPut:
		PutExpedicao(w, r)
	default:
		http.Error(w, "Metodo não permitido", http.StatusNotAcceptable)
	}

}

//Separando as funções

// if r.Method == http.MethodPost {
func PostExpedicao(w http.ResponseWriter, r *http.Request) {
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

// if r.Method == http.MethodGet {
func GetExpedicao(w http.ResponseWriter, r *http.Request) {
	lista, err := models.ListagemGeral(sql.DB)
	if err != nil {
		http.Error(w, "Erro ao buscar as expedições: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(lista)
	//return
}

// if r.Method == http.MethodDelete {
func DeleteExpedicao(w http.ResponseWriter, r *http.Request) {
	partPath := strings.Split(r.URL.Path, "/")
	deletarID := partPath[len(partPath)-1]
	//deletarID := r.URL.Query().Get("id")
	id, _ := strconv.Atoi(deletarID)
	if deletarID == "" {
		http.Error(w, "ID é obrigatório para exclusão", http.StatusBadRequest)
		return
	}
	err := models.ExcluirEx(sql.DB, id)
	if err != nil {
		http.Error(w, "Erro ao excluir expedição: "+err.Error(), http.StatusInternalServerError)
		return
	}
}
func PutExpedicao(w http.ResponseWriter, r *http.Request) {
	var ex models.Expedicao
	if err := json.NewDecoder(r.Body).Decode(&ex); err != nil {
		http.Error(w, "JSON INVÁLIDO", http.StatusBadRequest)
		return
	}
	err := ex.AlterarEx(sql.DB)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
