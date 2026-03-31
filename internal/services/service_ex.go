package services

import (
	"application-complexa/internal/domain"
	"application-complexa/internal/repository"
)

//var Expedicoes []Expedicao

type ExpedicaoService struct {
	repo *repository.ExpedicaoRepository
}

func NovoServico(repo *repository.ExpedicaoRepository) *ExpedicaoService {
	return &ExpedicaoService{repo: repo}
}

func (s *ExpedicaoService) CriarEX(e domain.Expedicao) (*domain.Expedicao, error) {
	e.Status = "Preparando Motores"

	if err := e.Valida(); err != nil {
		return nil, err
	}

	err := s.repo.SalvarNoBanco(e)
	if err != nil {
		return nil, err
	}
	return &e, nil
}

func (s *ExpedicaoService) ListagemGeral() ([]domain.Expedicao, error) {
	lista, err := s.repo.ListagemEx()
	if err != nil {
		return nil, err
	}
	return lista, nil
}

func (s *ExpedicaoService) AlterarEX(e *domain.Expedicao) error {
	if err := e.Valida(); err != nil {
		return err
	}

	return s.AlterarEX(e)
}

func (s *ExpedicaoService) ExcluirEX(id int) error {
	return s.repo.ExcluirEx(id)
}

// func CriarEx(nome, navio, capitao string, data_inicio time.Time) Expedicao {
// 	nova := Expedicao{
// 		Nome:        nome,
// 		Navio:       navio,
// 		Capitao:     capitao,
// 		Data_inicio: data_inicio,
// 		Status:      "Preparando Motores",
// 	}
// 	Expedicoes = append(Expedicoes, nova)
// 	//proximoID++
// 	return nova
// }
