*fluxo recomendado* 
      main
        ↑
       dev
        ↑  
    feat/beatriz
    feat/eduarda
    feat/geyslaine
    feat/lucas
*branches*
- `main`: versão estável do sistema.
- `dev`: integração das funcionalidades da equipe.
- `feat/*`: desenvolvimento individual de cada integrante.

# Primeira Configuração

Após clonar o projeto:

```bash
git clone https://github.com/mbeatrz13/VetOS.git
cd VetOS
```

Buscar todas as branches remotas:

```bash
git fetch --all
```

Criar a branch local correspondente:

```bash
git checkout -b feat/seu-nome origin/feat/seu-nome
```

Exemplo:

```bash
git checkout -b feat/beatriz origin/feat/beatriz
```

---

# Fluxo Diário de Trabalho

Atualizar sua branch antes de começar:

```bash
git checkout feat/seu-nome
git pull origin feat/seu-nome
git merge dev
```

Realizar alterações no projeto.

Adicionar arquivos:

```bash
git add .
```

Criar commit:

```bash
git commit -m "feat: descrição da funcionalidade"
```

Enviar para o GitHub:

```bash
git push origin feat/seu-nome
```

---

# Integração com a Branch Dev

Quando finalizar uma funcionalidade:

```bash
git checkout dev
git pull origin dev
git merge feat/seu-nome
git push origin dev
```

Ou abrir um Pull Request da sua branch para `dev`.

---

# Atualização da Main

Após testes e validações:

```bash
git checkout main
git pull origin main
git merge dev
git push origin main
```

---

# Convenção de Commits

### Funcionalidades

```text
feat: adiciona cadastro de animais
```

### Correções

```text
fix: corrige validação de login
```

### Refatoração

```text
refactor: reorganiza serviços de autenticação
```

### Documentação

```text
docs: atualiza README
```

### Estilos

```text
style: ajusta layout da tela de agenda
```

---

# Estrutura do Projeto

```text
VetOS/
├── backend/
├── frontend/
├── docs/
└── README.md
```
