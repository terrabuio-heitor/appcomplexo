package handlers

import (
	"application-complexa/internal/domain"
	"application-complexa/internal/services"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

func (h *ExpedicaoHandler) habilitarCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

type ExpedicaoHandler struct {
	service *services.ExpedicaoService
}

func NovoExpedicaoHandler(s *services.ExpedicaoService) *ExpedicaoHandler {
	return &ExpedicaoHandler{service: s}
}

func (h *ExpedicaoHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h.habilitarCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	switch r.Method {
	case http.MethodPost:
		h.PostExpedicao(w, r)
	case http.MethodGet:
		h.GetExpedicao(w, r)
	case http.MethodDelete:
		h.DeleteExpedicao(w, r)
	case http.MethodPut:
		h.PutExpedicao(w, r)
	default:
		http.Error(w, "Metodo não permitido", http.StatusNotAcceptable)
	}
}

func (h *ExpedicaoHandler) PostExpedicao(w http.ResponseWriter, r *http.Request) {
	var nova domain.Expedicao
	if err := json.NewDecoder(r.Body).Decode(&nova); err != nil {
		http.Error(w, "JSON Inválido!!!", http.StatusBadRequest)
		return
	}

	if err := nova.Valida(); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	resultado, err := h.service.CriarEX(nova)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resultado)
	w.WriteHeader(http.StatusCreated)
}

func (h *ExpedicaoHandler) GetExpedicao(w http.ResponseWriter, r *http.Request) {

	lista, err := h.service.ListagemGeral()
	if err != nil {
		http.Error(w, "Erro ao buscar as expedições: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if lista == nil {
		lista = []domain.Expedicao{}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(lista)
}

func (h *ExpedicaoHandler) PutExpedicao(w http.ResponseWriter, r *http.Request) {
	var ex domain.Expedicao
	if err := json.NewDecoder(r.Body).Decode(&ex); err != nil {
		http.Error(w, "JSON INVÁLIDO", http.StatusBadRequest)
		return
	}
	err := h.service.AlterarEX(&ex)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *ExpedicaoHandler) DeleteExpedicao(w http.ResponseWriter, r *http.Request) {
	partPath := strings.Split(r.URL.Path, "/")
	deletarID := partPath[len(partPath)-1]
	//deletarID := r.URL.Query().Get("id")
	id, _ := strconv.Atoi(deletarID)
	if deletarID == "" {
		http.Error(w, "ID é obrigatório para exclusão", http.StatusBadRequest)
		return
	}
	if err := h.service.ExcluirEX(id); err != nil {
		http.Error(w, "Erro ao excluir expedição: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
