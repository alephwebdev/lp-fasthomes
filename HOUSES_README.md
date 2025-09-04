# Como Adicionar Novas Casas

## 📋 Estrutura do JSON

Para adicionar uma nova casa, edite o arquivo `src/data/houses.json` e adicione um novo objeto seguindo este modelo:

```json
{
  "id": 7,
  "name": "Nome da Casa",
  "category": "casas", // ou "a-frame" ou "modulares"
  "categoryLabel": "/casas", // ou "/chalé a-frame" ou "/modulares"
  "description": "Descrição da casa aqui",
  "image": "URL_DA_IMAGEM",
  "alt": "Texto alternativo para a imagem"
}
```

## 🏠 Categorias Disponíveis

- **casas**: Casas tradicionais
- **a-frame**: Chalés A-Frame
- **modulares**: Casas Modulares

## 📝 Exemplo de Adição

Para adicionar uma nova casa "Ipê Amarelo":

```json
{
  "id": 7,
  "name": "Ipê Amarelo",
  "category": "casas",
  "categoryLabel": "/casas",
  "description": "Casa ampla com varanda gourmet e vista panorâmica",
  "image": "https://imagedelivery.net/1n9Gwvykoj9c9m8C_4GsGA/sua-nova-imagem/public",
  "alt": "Casa Ipê Amarelo"
}
```

## ⚡ Funcionalidades Automáticas

- ✅ **Renderização Dinâmica**: As casas são carregadas automaticamente do JSON
- ✅ **Filtros por Categoria**: Funcionam automaticamente com as novas casas
- ✅ **Carrossel Responsivo**: Adapta-se automaticamente ao número de casas
- ✅ **Animações AOS**: Mantidas em todos os cards
- ✅ **SEO Friendly**: Alt texts e loading lazy automáticos

## 🔧 API JavaScript (Opcional)

Se precisar adicionar casas via JavaScript:

```javascript
// Acessar o renderizador
const housesRenderer = window.housesRenderer;

// Adicionar uma nova casa
housesRenderer.addHouse({
  id: 8,
  name: "Nova Casa",
  category: "modulares",
  categoryLabel: "/modulares",
  description: "Descrição da nova casa",
  image: "url-da-imagem",
  alt: "Alt text"
});

// Filtrar por categoria
housesRenderer.filterByCategory('a-frame');
```

## 📁 Estrutura de Arquivos

```
src/
├── data/
│   └── houses.json          // 📋 Dados das casas
├── scripts/
│   ├── houses-renderer.js   // 🔧 Renderizador dinâmico
│   └── houses-carousel.js   // 🎠 Carrossel e filtros
```
