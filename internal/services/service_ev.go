package services

import (
	"application-complexa/internal/domain"
	"application-complexa/internal/repository"
)

type EventoService struct {
	repo *repository.EventoRepository
}

//REST

func NovoServicoEV(repo *repository.EventoRepository) *EventoService {
	return &EventoService{repo: repo}
}

func (s *EventoService) CriarEV(e domain.Evento) (*domain.Evento, error) {

	if err := e.Valida(); err != nil {
		return nil, err
	}

	err := s.repo.SalvarNoBanco(e)
	if err != nil {
		return nil, err
	}
	return &e, nil
}

func (s *EventoService) ListagemGeral() ([]domain.Evento, error) {
	lista, err := s.repo.ListagemEv()
	if err != nil {
		return nil, err
	}
	return lista, nil
}

func (s *EventoService) AlterarEv(e *domain.Evento) error {
	if err := e.Valida(); err != nil {
		return err
	}

	return s.repo.AlterarEv(e)
}

func (s *EventoService) ExcluirEv(id int) error {
	return s.repo.ExcluirEv(id)
}
