package domain

import (
	"errors"
	"strings"
	"time"
)

// var proximoID = 1

type Expedicao struct {
	ID      int    `json:"id"`
	Nome    string `json:"nome"`
	Navio   string `json:"navio"`
	Capitao string `json:"capitao"`
	//Data_inicio string `json:"data_inicio"`
	Data_inicio time.Time `json:"data_inicio"`
	Status      string    `json:"status"`
}

func (e *Expedicao) Valida() error {
	if strings.TrimSpace(e.Nome) == "" {
		return errors.New("nome da expedição obrigatório")
	}

	if strings.TrimSpace(e.Navio) == "" {
		return errors.New("nome do navio obrigatório")
	}

	if strings.TrimSpace(e.Capitao) == "" {
		return errors.New("capitão obrigatório")
	}

	return nil
}

// func main() {
// 	fmt.Println("--- 🌊 Sistema de Gestão de Viagens Marítimas ---")

// 	// Criando a primeira jornada!
// 	viagem := CriarEx("Em Busca do Kraken", "Pérola Negra", "Jack Sparrow")

// 	fmt.Printf("Expedição '%s' iniciada com o navio '%s' sob o comando de %s!\n",
// 		viagem.Nome, viagem.Navio, viagem.Capitao)
// 	fmt.Println("Status atual:", viagem.Status)
// }
