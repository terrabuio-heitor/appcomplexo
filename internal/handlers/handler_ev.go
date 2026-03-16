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

func EventosHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	switch r.Method {
	case http.MethodGet:
		GetEvento(w, r)
	case http.MethodPost:
		PostEvento(w, r)
	case http.MethodPut:
		PutEvento(w, r)
	case http.MethodDelete:
		DeleteEventos(w, r)
	default:
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
	}
}

// funcões do REST
func GetEvento(w http.ResponseWriter, r *http.Request) {
	lista, err := models.ListagemEventos(sql.DB)
	if err != nil {
		http.Error(w, "Erro ao buscar os Eventos: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(lista)
	//return
}

func PostEvento(w http.ResponseWriter, r *http.Request) {
	var nova models.Evento
	if err := json.NewDecoder(r.Body).Decode(&nova); err != nil {
		http.Error(w, "JSON Inválido!!!", http.StatusBadRequest)
		return
	}

	if err := nova.Valida(); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	//se passou pelas 2 verificações

	resultado := models.CriarEvento(nova.Descricao, nova.Tipo, nova.Data, nova.ExpedicaoID)

	err := resultado.SalvarNoBanco(sql.DB)
	if err != nil {
		http.Error(w, "Erro ao salvar no banco: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resultado)
}
func PutEvento(w http.ResponseWriter, r *http.Request) {
	var ex models.Evento
	if err := json.NewDecoder(r.Body).Decode(&ex); err != nil {
		http.Error(w, "JSON INVÁLIDO", http.StatusBadRequest)
		return
	}
	err := ex.AlterarEv(sql.DB)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func DeleteEventos(w http.ResponseWriter, r *http.Request) {
	partPath := strings.Split(r.URL.Path, "/")
	deletarID := partPath[len(partPath)-1]
	//deletarID := r.URL.Query().Get("id")
	id, _ := strconv.Atoi(deletarID)
	if deletarID == "" {
		http.Error(w, "ID é obrigatório para exclusão", http.StatusBadRequest)
		return
	}
	err := models.ExcluirEv(sql.DB, id)
	if err != nil {
		http.Error(w, "Erro ao excluir evento: "+err.Error(), http.StatusInternalServerError)
		return
	}
}
