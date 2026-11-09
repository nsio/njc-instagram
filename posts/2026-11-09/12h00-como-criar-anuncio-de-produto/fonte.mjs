// Fonte do carrossel. Gere as imagens com: npm run gerar -- posts/2026-11-09/12h00-como-criar-anuncio-de-produto
export default ({ assets }) => {
  const cover = `${assets}/capas/como-criar-anuncio-de-produto.jpg`
  return {
  produto: 'Etalagiste',
  accent: '#2ee6c5',
  slides: [
    {
      cls: 'cover',
      html: `<div class="cover-img" style="background-image:url('${cover}')"></div>
      <div class="main">
        <div class="eyebrow">Guia de anúncios</div>
        <h1>Como criar um anúncio de produto que vende</h1>
        <p class="lead">São <strong>4 partes</strong>, e cada uma tem um trabalho diferente.</p>
      </div>`,
    },
    {
      html: `<div class="main">
        <h2>As 4 partes de um anúncio</h2>
        <div class="parts">
          <div class="part"><span class="k">Foto</span><span class="v">faz a pessoa parar</span></div>
          <div class="part"><span class="k">Título</span><span class="v">faz o anúncio aparecer na busca</span></div>
          <div class="part"><span class="k">Descrição</span><span class="v">tira as dúvidas que impedem a compra</span></div>
          <div class="part"><span class="k">Ficha técnica</span><span class="v">coloca o produto nos filtros</span></div>
        </div>
        <p class="note">Se uma delas falha, as outras não compensam.</p>
      </div>`,
    },
    {
      html: `<div class="main">
        <div class="eyebrow">1 · Foto principal</div>
        <h2>O produto inteiro, sozinho e bem iluminado</h2>
        <ul class="items">
          <li><b>1200 × 1200 pixels:</b> o tamanho recomendado pelo Mercado Livre</li>
          <li><b>Fundo branco obrigatório</b> em Tecnologia, Beleza, Saúde e Supermercado</li>
          <li><b>Sem</b> marca d'água, logotipo ou bordas</li>
        </ul>
        <p class="note">Fotografe perto de uma janela, sem sol direto. Nenhuma edição recupera um produto escuro.</p>
      </div>`,
    },
    {
      html: `<div class="main">
        <div class="eyebrow">2 · Título</div>
        <h2>Use as palavras que o comprador digitaria</h2>
        <div class="cmp">
          <div class="bad"><small>Fraco</small>Tênis lindo promoção frete grátis</div>
          <div class="good"><small>Melhor</small>Tênis de corrida Marca X Modelo Y masculino</div>
        </div>
        <ul class="items">
          <li><b>Fora do título:</b> frete, parcelamento, promoção e se é novo ou usado</li>
          <li><b>Sem a cor,</b> se você vende o produto em várias cores</li>
        </ul>
      </div>`,
    },
    {
      html: `<div class="main">
        <div class="eyebrow">3 · Descrição</div>
        <h2>Responda o que o comprador não pode tocar</h2>
        <ol class="steps">
          <li>O que é e para quem serve</li>
          <li>Medidas e capacidade, com números</li>
          <li>Material e acabamento</li>
          <li>Como usar e como cuidar</li>
          <li>O que vem na embalagem</li>
          <li>Garantia e troca</li>
        </ol>
        <p class="note">Não escreva o que você não pode comprovar.</p>
      </div>`,
    },
    {
      html: `<div class="main">
        <div class="eyebrow">4 · Ficha técnica</div>
        <h2>É ela que coloca o produto nos filtros</h2>
        <ul class="items">
          <li><b>Preencha tudo o que se aplica,</b> não só o obrigatório</li>
          <li><b>Use o valor exato:</b> “38”, e não “M”, quando a categoria pede numeração</li>
          <li><b>Na dúvida, meça.</b> Medida errada é filtro errado e devolução depois</li>
        </ul>
      </div>`,
    },
    {
      html: `<div class="main">
        <h2>Checklist antes de publicar</h2>
        <ul class="check">
          <li>Foto principal com o produto inteiro, sem logotipo nem texto</li>
          <li>Fundo branco, se a categoria exigir</li>
          <li>Fotos de apoio: ângulos, detalhes e defeitos</li>
          <li>Título com produto, marca e modelo</li>
          <li>Descrição com medidas, material e o que vem na caixa</li>
          <li>Ficha técnica completa, com valores exatos</li>
        </ul>
      </div>`,
    },
    {
      html: `<div class="main">
        <h2>O guia completo está no blog</h2>
        <p class="lead">Com as regras oficiais do Mercado Livre, exemplos e o checklist inteiro.</p>
        <div class="url">Link na bio</div>
        <div class="cta-box">
          <span class="t">Quer o rascunho pronto?</span>
          <span class="d">O <strong class="hl">NjC-IA Etalagiste</strong> remove o fundo da foto e gera título, descrição e ficha técnica. Você só revisa. Teste grátis, sem cadastro.</span>
        </div>
      </div>`,
    },
  ],
  legenda: `
Um anúncio que vende tem 4 partes, e cada uma tem um trabalho diferente: a foto faz a pessoa parar, o título faz o anúncio aparecer na busca, a descrição tira as dúvidas e a ficha técnica coloca o produto nos filtros.

Arraste para ver como fazer cada uma, com as regras oficiais do Mercado Livre.

Salve este post para conferir antes do próximo anúncio.

Guia completo, com checklist: link na bio.

#ecommerce #mercadolivre #vendasonline #anunciodeproduto #fotodeproduto #lojavirtual #empreendedorismo #shopee
`,
  }
}
