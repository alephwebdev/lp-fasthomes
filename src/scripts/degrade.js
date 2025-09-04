// Observa a posição do overlay e alterna uma classe quando estiver sobre seções escuras
(function () {
    // Classe aplicada ao elemento .degrade quando estiver sobre uma seção escura
    const DARK_CLASS = 'degrade--dark';
    const darkBackground = '#1d1d1b';

    const overlay = document.querySelector('.degrade');
    if (!overlay) return;

    // Pegar todas as seções que podem ter um background escuro.
    const candidateSections = Array.from(document.querySelectorAll('section, footer'));

    // Função que determina se uma section tem fundo exatamente igual a darkBackground
    function sectionIsDark(el) {
        // checa estilo inline ou computado
        const bg = window.getComputedStyle(el).backgroundColor;
        if (!bg) return false;
        // normaliza cores para rgb/hex equivalentes
        // compara aproximando valores
        const rgb = bg.match(/\d+/g);
        if (!rgb) return false;
        const [r, g, b] = rgb.map(Number);
        return (r === 29 && g === 29 && b === 27);
    }

    // Pré-filtra seções escuras (isso evita checagens frequentes)
    const darkSections = candidateSections.filter(sectionIsDark);

    // Se não achar por estilo computado, também permite identificar por classe/atributo
    // Ex: <section class="houses" data-bg-dark> ou estilos em CSS que não expõem a cor.
    if (darkSections.length === 0) {
        // fallback: procurar seções com classe que contenham 'dark' ou 'houses' (heurística)
        const heuristics = candidateSections.filter(s => {
            const cls = s.className || '';
            return /dark|black|houses|footer/i.test(cls) || s.dataset.bgDark !== undefined;
        });
        // use heuristics as potential dark sections
        heuristics.forEach(s => darkSections.push(s));
    }

    // Observador de scroll: verifica se o overlay está sobre um trecho escuro
    function checkOverlay() {
        const overlayRect = overlay.getBoundingClientRect();
        // point to test: center-top of overlay (slightly above bottom)
        const testY = overlayRect.top + 10; // 10px from top of overlay
        const testX = overlayRect.left + overlayRect.width / 2;

        // pega o elemento naquele ponto
        const el = document.elementFromPoint(testX, testY);
        if (!el) {
            overlay.classList.remove(DARK_CLASS);
            return;
        }

        // sobe na árvore até achar uma section/footer
        const section = el.closest('section, footer');
        if (!section) {
            overlay.classList.remove(DARK_CLASS);
            return;
        }

        // Marcar se a seção atual é considerada escura
        const isDark = darkSections.includes(section) || section.dataset.bgDark !== undefined || sectionIsDark(section);
        overlay.classList.toggle(DARK_CLASS, isDark);
    }

    // throttle simples
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => { checkOverlay(); ticking = false; });
            ticking = true;
        }
    }

    // Observa mudanças de layout também (resizes, imagens loading)
    const ro = new ResizeObserver(onScroll);
    candidateSections.forEach(s => ro.observe(s));

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Checagem inicial
    document.addEventListener('DOMContentLoaded', checkOverlay);
    checkOverlay();
})();
