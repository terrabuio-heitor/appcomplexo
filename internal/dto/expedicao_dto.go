package dto

type ExpedicaoDTO struct {
	Nome    string `json:"nome"`
	Navio   string `json:"navio"`
	Capitao string `json:"capitao"`
	Status  string `json:"status"`
}
