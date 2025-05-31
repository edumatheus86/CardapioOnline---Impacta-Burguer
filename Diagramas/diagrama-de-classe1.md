```mermaid
classDiagram
    %% Definição de classes e atributos
    class Usuario {
        +String nome
        +String telefone
        +String email
        +String senha
        +String endereco
        +fazerCadastro()
        +fazerLogin()
    }

    class Item {
        +String name
        +Float price
        +Int quantity
        +calcularSubtotal() : Float
    }

    class Carrinho {
        -List~Item~ itens
        +Float total
        +adicionarItem(item: Item)
        +removerItem(item: Item)
        +calcularTotal() : Float
    }

    class Pedido {
        +String id
        +Usuario cliente
        +List~Item~ itens
        +String enderecoEntrega
        +Date data
        +String status
        +gerarPedido()
        +atualizarStatus(novoStatus: String)
    }

    %% Relacionamentos
    Usuario "1" --> "1" Carrinho : possui >
    Carrinho "1" *-- "*" Item : contém >
    Usuario "1" --> "*" Pedido  : faz >
    Pedido "1" o-- "*" Item    : inclui >