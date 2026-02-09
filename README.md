# Como executar o projeto

- Iniciar db: docker compose up -d db
- Executar migrations: docker compose run --rm migrator
- Iniciar front e back: docker compose up -d backend frontend