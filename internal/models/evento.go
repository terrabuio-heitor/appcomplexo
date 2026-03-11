package models

type Eventos struct {
	ID          int    `json:"id"`
	Descricao   string `json:"descricao"`
	tipo        string `json:"tipo"`
	data        string `json:"data"`
	expedicaoID int    `json:"ExId"`
}
