/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.maisVida.consultoria.service;

import com.maisVida.consultoria.model.Cliente;
import com.maisVida.consultoria.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public Cliente criarCliente(Cliente cliente) {
        if (cliente.getNome().length() > 100) {
            throw new IllegalArgumentException("Nome não pode ter mais de 100 caracteres!");
        }
        if (cliente.getCpf().length() > 14) {
            throw new IllegalArgumentException("CPF não pode ter mais de 14 caracteres!");
        }
        if (cliente.getTelefone() != null && cliente.getTelefone().length() > 14) {
            throw new IllegalArgumentException("Telefone não pode ter mais de 14 caracteres!");
        }
        if (clienteRepository.existsByEmail(cliente.getEmail())) {
            throw new IllegalArgumentException("Email já cadastrado!");
        }
        if (clienteRepository.existsByCpf(cliente.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado!");
        }
        if (clienteRepository.existsByNome(cliente.getNome())) {
            throw new IllegalArgumentException("Nome já cadastrado!");
        }

        return clienteRepository.save(cliente);
    }
}

