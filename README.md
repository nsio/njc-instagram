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

1. Os posts do dia chegam num **PR**. O PR é o pedido de aprovação.
2. **Merge do PR = aprovado.** Sem merge, nada é publicado.
3. O GitHub Pages coloca as imagens no ar em `https://nsio.github.io/njc-instagram/...`. A API do Instagram só aceita imagem por link público.
4. A automação [Publicar no Instagram](.github/workflows/publicar.yml) roda a cada 15 minutos e publica **um post por vez**, quando o horário de `post.json` chega.
5. Depois de publicar, ela grava `publicado.json` com o link do post.

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
