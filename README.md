# Consulta de Entrega - PWA

Projeto adaptado para Progressive Web App (PWA).

## Requisitos da atividade atendidos

- Instalação como PWA por meio de `manifest.json` e Service Worker.
- Interface responsiva para celulares e computadores.
- Uso de funcionalidade do dispositivo: **Geolocalização**, utilizando `navigator.geolocation`.
- Consulta de CEP mantida com a API ViaCEP.
- Service Worker com cache do app shell para melhorar o funcionamento offline.
- Manifesto com ícones 192x192 e 512x512.

## Como testar

1. Suba os arquivos para o GitHub.
2. Faça o deploy no Vercel (ou outro servidor HTTPS).
3. Abra o site pelo celular.
4. Use o botão **Usar minha localização** e aceite a permissão de localização.
5. No navegador, procure a opção **Instalar aplicativo** / **Adicionar à tela inicial**.

> A geolocalização exige contexto seguro (HTTPS, como no Vercel) ou localhost durante o desenvolvimento.

## Arquivos adicionados/modificados

- `index.html`
- `style.css`
- `script.js`
- `manifest.json`
- `sw.js`
- `icons/icon-192.png`
- `icons/icon-512.png`
