package com.maisVida.consultoria.service;

import com.maisVida.consultoria.model.Cliente;
import com.maisVida.consultoria.model.Consultoria;
import com.maisVida.consultoria.repository.ClienteRepository;
import com.maisVida.consultoria.repository.ConsultoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ConsultoriaService {

    @Autowired
    private ConsultoriaRepository consultoriaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    public Consultoria criarConsultoria(Consultoria consultoria) {
        if (consultoria.getCliente() == null || consultoria.getCliente().getEmail() == null) {
            throw new IllegalArgumentException("Cliente não informado!");
        }

        Cliente cliente = clienteRepository.findByEmail(consultoria.getCliente().getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado!"));

        consultoria.setCliente(cliente);

        boolean conflito = consultoriaRepository.existsByMedicoAndDataAndHora(
                consultoria.getMedico(), consultoria.getData(), consultoria.getHora());

        if (conflito) {
            throw new IllegalArgumentException("Já existe uma consultoria com esse médico nesse horário!");
        }

        return consultoriaRepository.save(consultoria);
    }

    public void deletarConsultoria(Long id) {
        if (!consultoriaRepository.existsById(id)) {
            throw new IllegalArgumentException("Consultoria não encontrada!");
        }
        consultoriaRepository.deleteById(id);
    }

}
