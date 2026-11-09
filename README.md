# Posts do Instagram da NjC-IA

Os posts do perfil [@njc.ia](https://www.instagram.com/njc.ia/), organizados por dia e horário de publicação.

```
posts/
  2026-11-09/                          ← um dia
    12h00-como-criar-anuncio-de-produto/   ← um post (hora + assunto)
      01.jpg … 08.jpg    imagens do carrossel, 1080 × 1350
      legenda.txt        texto do post
      post.json          horário de publicação e artigo de origem
      fonte.mjs          conteúdo dos slides (gera as imagens)
      publicado.json     criado pela automação depois de publicar
```

## Como um post vai para o ar

Nada é agendado: a publicação só acontece quando alguém dispara.

1. O post é gerado na pasta do dia e revisado.
2. Com a aprovação, a automação [Publicar no Instagram](.github/workflows/publicar.yml) é disparada à mão (Actions → Publicar no Instagram → Run workflow).
3. Ela publica **um post** pendente, usando as imagens do GitHub Pages (`https://nsio.github.io/njc-instagram/...`), porque a API do Instagram só aceita imagem por link público.
4. Depois de publicar, ela grava `publicado.json` com o link do post.

Se a publicação falhar, a execução fica vermelha em **Actions** e o GitHub manda e-mail.

## Gerar as imagens de um post

```
npm install
npm run gerar -- posts/2026-11-09/12h00-como-criar-anuncio-de-produto
```

Precisa do Edge ou do Chrome instalado.

## Segredos

- `INSTAGRAM_TOKEN`: token de usuário do sistema da Meta (app "NjC-IA Publicador", login unificado). Não expira.
- Nunca colocar o token em arquivo, commit ou mensagem.
