# Justificativa de Ponto automática (PWA)

Aplicativo que lê o espelho de ponto em PDF (ou foto) e gera a Justificativa de Ponto preenchida, com letra manuscrita.
Tudo roda no aparelho do usuário; nenhum arquivo é enviado a servidores.

## Arquivos
| Arquivo | Para que serve |
|---|---|
| `index.html` | O aplicativo inteiro (leitor de PDF, regras, formulário da Prefeitura e fonte manuscrita embutidos) |
| `manifest.webmanifest` | Nome, cores e ícones do aplicativo instalado |
| `sw.js` | Service worker: faz o aplicativo abrir sem internet |
| `icons/` | Ícones 48 a 512 px, versão *maskable* (Android), `apple-touch-icon` (iPhone/iPad) e favicon |

## Como publicar (precisa de HTTPS)
O navegador só permite instalar PWA e usar service worker em endereço `https://` (ou `localhost`).
Abrir o `index.html` direto do disco funciona como página comum, mas **não instala**.

Opções gratuitas, todas enviando a pasta inteira:
- **Netlify Drop**: acesse app.netlify.com/drop e arraste esta pasta.
- **GitHub Pages**: suba os arquivos em um repositório e ative Settings > Pages.
- **Cloudflare Pages**: Create project > Upload assets.

Para testar no computador: dentro desta pasta, rode `python3 -m http.server 8000` e abra `http://localhost:8000`.

## Instalar
- **Chrome/Edge (computador e Android)**: botão "Instalar aplicativo" no topo da página, ou o ícone de instalar na barra de endereço.
- **iPhone/iPad (Safari)**: Compartilhar > Adicionar à Tela de Início.

## Atualizar uma versão
Troque os arquivos no hospedeiro e aumente `VERSION` em `sw.js` (ex.: `v1` para `v2`). Os aparelhos atualizam na próxima abertura.

## Observações
- A leitura de espelhos escaneados usa OCR (Tesseract.js, carregado de cdn.jsdelivr.net). Na primeira leitura é preciso internet; o service worker guarda as bibliotecas para as próximas vezes.
- O formulário usa as medidas do modelo "Justificativa de Ponto" enviado. Se a Prefeitura mudar o modelo, as posições dos campos precisam ser refeitas.
- Fonte manuscrita: *Nothing You Could Do*, de Kimberly Geswein, licença SIL Open Font License 1.1.
