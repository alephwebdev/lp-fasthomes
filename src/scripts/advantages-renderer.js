// Advantages Dynamic Renderer
class AdvantagesRenderer {
    constructor() {
        this.advantagesData = null;
        this.optionsContainer = null;
        this.init();
    }

    async init() {
        try {
            await this.loadAdvantagesData();
            this.setupAdvantages();
        } catch (error) {
            console.error('Erro ao inicializar AdvantagesRenderer:', error);
        }
    }

    async loadAdvantagesData() {
        try {
            const response = await fetch('src/data/advantages.json');
            const data = await response.json();
            this.advantagesData = data.advantages;
        } catch (error) {
            console.error('Erro ao carregar dados das vantagens:', error);
            throw error;
        }
    }

    setupAdvantages() {
        this.optionsContainer = document.querySelector('.advantage-options ol');
        if (!this.optionsContainer || !this.advantagesData) {
            console.error('Container das vantagens ou dados não encontrados');
            return;
        }

        // Limpa o conteúdo existente
        this.optionsContainer.innerHTML = '';

        // Adiciona os data attributes nas opções
        this.advantagesData.forEach((advantage, index) => {
            const li = document.createElement('li');
            li.className = 'advantage-option';
            li.textContent = advantage.title;
            li.setAttribute('data-image', advantage.image);
            li.setAttribute('data-description', advantage.description);
            
            // Define o primeiro como ativo
            if (index === 0) {
                li.classList.add('active');
            }

            this.optionsContainer.appendChild(li);
        });

        // Atualiza o conteúdo inicial do slide
        this.updateInitialSlide();

        // Dispara evento para notificar que as vantagens foram renderizadas
        document.dispatchEvent(new CustomEvent('advantagesRendered'));
    }

    updateInitialSlide() {
        if (!this.advantagesData || this.advantagesData.length === 0) return;

        const firstAdvantage = this.advantagesData[0];
        const slideEl = document.querySelector('.advantage-carousel .splide__slide');
        
        if (slideEl) {
            const imgEl = slideEl.querySelector('img');
            const titleEl = slideEl.querySelector('aside h2');
            const descEl = slideEl.querySelector('.advantage-carousel-item-description');

            if (imgEl) imgEl.src = firstAdvantage.image;
            if (titleEl) titleEl.textContent = firstAdvantage.title;
            if (descEl) descEl.textContent = firstAdvantage.description;
        }
    }

    // Método para adicionar uma nova vantagem
    addAdvantage(newAdvantage) {
        if (!this.advantagesData) {
            console.error('Dados das vantagens não carregados');
            return;
        }

        this.advantagesData.push(newAdvantage);
        this.setupAdvantages();
    }
}

// Inicializa o renderizador quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new AdvantagesRenderer();
});
