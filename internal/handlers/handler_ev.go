package handlers

import (
	"application-complexa/internal/domain"
	"application-complexa/internal/dto"
	"application-complexa/internal/services"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

func (h *EventoHandler) habilitarCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

// construtores
type EventoHandler struct {
	service *services.EventoService
}

func NovaEventoHandler(s *services.EventoService) *EventoHandler {
	return &EventoHandler{service: s}
}

//rest

func (h *EventoHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h.habilitarCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	switch r.Method {
	case http.MethodPost:
		h.PostEvento(w, r)
	case http.MethodGet:
		h.GetEvento(w, r)
	case http.MethodDelete:
		h.DeleteEvento(w, r)
	case http.MethodPut:
		h.PutEvento(w, r)
	default:
		http.Error(w, "Metodo não permitido", http.StatusNotAcceptable)
	}
}

// REST
func (h *EventoHandler) PostEvento(w http.ResponseWriter, r *http.Request) {
	//var nova domain.Evento
	var dto dto.EventoDTO

	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		http.Error(w, "JSON Inválido!!!", http.StatusBadRequest)
		return
	}
	nova := domain.Evento{
		Tipo:        dto.Tipo,
		Descricao:   dto.Descricao,
		ExpedicaoID: dto.ExpedicaoID,
	}

	if err := nova.Valida(); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	resultado, err := h.service.CriarEV(nova)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resultado)

	w.WriteHeader(http.StatusCreated)
}

func (h *EventoHandler) GetEvento(w http.ResponseWriter, r *http.Request) {

	lista, err := h.service.ListagemGeral()
	if err != nil {
		http.Error(w, "Erro ao buscar os eventos: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if lista == nil {
		lista = []domain.Evento{}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(lista)
}

func (h *EventoHandler) PutEvento(w http.ResponseWriter, r *http.Request) {
	//var ex domain.Evento
	var dto dto.EventoDTO
	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		http.Error(w, "JSON INVÁLIDO", http.StatusBadRequest)
		return
	}
	ex := domain.Evento{
		Tipo:        dto.Tipo,
		Descricao:   dto.Descricao,
		ExpedicaoID: dto.ExpedicaoID,
	}
	err := h.service.AlterarEv(&ex)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *EventoHandler) DeleteEvento(w http.ResponseWriter, r *http.Request) {
	partPath := strings.Split(r.URL.Path, "/")
	deletarID := partPath[len(partPath)-1]
	//deletarID := r.URL.Query().Get("id")
	id, _ := strconv.Atoi(deletarID)
	if deletarID == "" {
		http.Error(w, "ID é obrigatório para exclusão", http.StatusBadRequest)
		return
	}
	if err := h.service.ExcluirEv(id); err != nil {
		http.Error(w, "Erro ao excluir evento: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
