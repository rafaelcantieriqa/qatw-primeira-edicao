# QA Tech Week - Primeira Edição
![E2E Tests](https://github.com/rafaelcantieriqa/qatw-primeira-edicao/actions/workflows/e2e-tests.yml/badge.svg)


Bem-vindo ao repositório do **QA Tech Week - Primeira Edição**! Aqui você encontrará as instruções para configurar o ambiente, subir os serviços necessários e rodar os testes automatizados com Playwright.

## 📌 Pré-requisitos
Antes de começar, certifique-se de ter os seguintes softwares instalados em seu sistema:

- [Git for Windows](https://gitforwindows.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js (versão LTS)](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## 🐋 Guia de Instalação do Docker
- [Windows](https://dev.to/papitofernando/instalando-o-docker-no-windows-10-home-ou-professional-com-wsl-2-26m3)
- [MacOS](https://docs.docker.com/desktop/setup/install/mac-install/)
- [Linux Ubuntu](https://docs.docker.com/engine/install/ubuntu/)

## 🚀 Configuração do Ambiente
1. Faça um Fork do projeto
2. Clone este repositório:
   ```sh
   git clone git@github.com:seu-usuario/qatw-primeira-edicao.git
   cd qatw-primeira-edicao
   ```
   
## 🐳 Subindo o Ambiente com Docker Compose
O projeto utiliza Docker Compose para gerenciar os serviços necessários para os testes.

1. Certifique-se de que o Docker Desktop está em execução.
2. No terminal, execute o comando abaixo para subir os serviços:
   ```sh
   docker-compose up -d
   ```
3. Para verificar se os contêineres estão rodando:
   ```sh
   docker ps
   ```
4. Para parar os serviços:
   ```sh
   docker-compose down
   ```

## 🔐 Variáveis de ambiente
Copie o arquivo `.env.example` para `.env` e preencha os dados do Mailtrap (o `.env` não vai para o Git):
```sh
cp .env.example .env
```

## 🧪 Executando os Testes com Playwright

1. Instale as dependências:
   ```sh
   npm ci
   npx playwright install chromium
   ```
2. Rodar os testes:
   ```sh
   npm test
   ```
3. Relatório HTML do Playwright:
   ```sh
   npx playwright show-report
   ```
4. Modo UI:
   ```sh
   npm run test:ui
   ```

## 📊 Allure Report
Usa o **Allure 3** (CLI em Node.js — não precisa de Java).

```sh
npm run test:allure     # limpa resultados, roda os testes e gera ./allure-report
npm run allure:open     # abre o relatório no navegador
```

## ⚙️ CI/CD (GitHub Actions)
O workflow fica em `.github/workflows/e2e-tests.yml` e roda a cada push, em PRs para a `main` e manualmente (aba **Actions → E2E Tests → Run workflow**).

Ele sobe o ambiente com Docker Compose, roda os testes e publica os relatórios Allure e Playwright como *artifacts* da execução.

Opcional:
- **Secrets** (Settings → Secrets and variables → Actions → Secrets): `MAILTRAP_ACCOUNT_ID`, `MAILTRAP_TOKEN`, `MAILTRAP_INBOX_ID`.
- **Allure no GitHub Pages**: em Settings → Pages, escolha *Source: GitHub Actions*; depois crie a variável `ALLURE_PAGES` = `true` (Settings → Secrets and variables → Actions → Variables).

## 📄 Licença
Este projeto está sob a licença MIT.
