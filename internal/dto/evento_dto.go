package dto

type EventoDTO struct {
	Tipo        string `json:"tipo"`
	Descricao   string `json:"descricao"`
	ExpedicaoID int    `json:"expedicao_id"`
}
