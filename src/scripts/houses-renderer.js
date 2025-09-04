// Houses Dynamic Renderer
class HousesRenderer {
    constructor() {
        this.housesData = null;
        this.container = null;
        this.init();
    }

    async init() {
        try {
            await this.loadHousesData();
            this.setupContainer();
            this.renderHouses();
        } catch (error) {
            console.error('Erro ao inicializar HousesRenderer:', error);
        }
    }

    async loadHousesData() {
        try {
            const response = await fetch('src/data/houses.json');
            const data = await response.json();
            this.housesData = data.houses;
        } catch (error) {
            console.error('Erro ao carregar dados das casas:', error);
            throw error;
        }
    }

    setupContainer() {
        this.container = document.querySelector('.houses-carousel .splide__list');
        if (!this.container) {
            console.error('Container das casas não encontrado');
            return;
        }
        // Limpa o conteúdo existente
        this.container.innerHTML = '';
    }

    createHouseCard(house) {
        return `
            <li class="splide__slide" data-category="${house.category}">
                <div class="houses-carousel-item">
                    <img src="${house.image}" alt="${house.alt}" loading="lazy">
                    <article>
                        <div>
                            <h2>${house.name}</h2>
                            <span>${house.categoryLabel}</span>
                        </div>
                        <p>${house.description}</p>
                    </article>
                </div>
            </li>
        `;
    }

    renderHouses() {
        if (!this.housesData || !this.container) {
            console.error('Dados das casas ou container não disponível');
            return;
        }

        const housesHTML = this.housesData
            .map(house => this.createHouseCard(house))
            .join('');

        this.container.innerHTML = housesHTML;

        // Dispara evento customizado para notificar que as casas foram renderizadas
        document.dispatchEvent(new CustomEvent('housesRendered'));
    }

    // Método para adicionar uma nova casa
    addHouse(newHouse) {
        if (!this.housesData) {
            console.error('Dados das casas não carregados');
            return;
        }

        this.housesData.push(newHouse);
        this.renderHouses();
    }

    // Método para filtrar casas por categoria
    filterByCategory(category) {
        if (!this.housesData || !this.container) {
            console.error('Dados das casas ou container não disponível');
            return;
        }

        const filteredHouses = category === 'all' 
            ? this.housesData 
            : this.housesData.filter(house => house.category === category);

        const housesHTML = filteredHouses
            .map(house => this.createHouseCard(house))
            .join('');

        this.container.innerHTML = housesHTML;
        
        // Dispara evento para atualizar o carrossel
        document.dispatchEvent(new CustomEvent('housesFiltered', { 
            detail: { category, count: filteredHouses.length } 
        }));
    }
}

// Inicializa o renderizador quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new HousesRenderer();
});
