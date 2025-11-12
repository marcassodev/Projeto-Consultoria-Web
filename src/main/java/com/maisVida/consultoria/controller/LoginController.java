
package com.maisVida.consultoria.controller;

import com.maisVida.consultoria.model.Cliente;
import com.maisVida.consultoria.repository.ClienteRepository;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private ClienteRepository clienteRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> dados) {
        String email = dados.get("email");
        String senha = dados.get("senha");

        Optional<Cliente> clienteOpt = clienteRepository.findByEmail(email);

        if (clienteOpt.isPresent() && clienteOpt.get().getSenha().equals(senha)) {
            Cliente cliente = clienteOpt.get();

            Map<String, Object> resposta = new HashMap<>();
            resposta.put("id", cliente.getId());
            resposta.put("nome", cliente.getNome());
            resposta.put("email", cliente.getEmail());
            resposta.put("cpf", cliente.getCpf());
            resposta.put("telefone", cliente.getTelefone());
            resposta.put("nascimento", cliente.getNascimento());
            resposta.put("message", "Login realizado com sucesso!");

            return ResponseEntity.ok(resposta);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Email ou senha incorretos"));
        }
    }
}


