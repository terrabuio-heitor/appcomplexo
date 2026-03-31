package domain

import (
	"errors"
	"strings"
	"time"
)

type Evento struct {
	ID          int       `json:"id"`
	Tipo        string    `json:"tipo"`
	Descricao   string    `json:"descricao"`
	Data        time.Time `json:"data"`
	ExpedicaoID int       `json:"expedicao_id"` // O elo com a viagem
}

func (e *Evento) Valida() error {
	if strings.TrimSpace(e.Descricao) == "" {
		//Erro = "Erro no Nome"
		return errors.New("descrição do evento obrigatória")
	}

	if strings.TrimSpace(e.Tipo) == "" {
		//Erro = "Erro no Navio"
		return errors.New("tipo do evento obrigatório")
	}
	return nil
}
