package com.maisVida.consultoria.controller;

import com.maisVida.consultoria.model.Cliente;
import com.maisVida.consultoria.service.ClienteService;
import java.util.Collections;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @PostMapping
    public ResponseEntity<Map<String, String>> criarCliente(@RequestBody Cliente cliente) {
        try {
            clienteService.criarCliente(cliente);
            return ResponseEntity.ok(Collections.singletonMap("message", "Cadastro realizado com sucesso!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

}
