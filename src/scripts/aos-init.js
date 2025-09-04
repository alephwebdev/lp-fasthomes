// Inicialização do AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        // Configurações globais
        offset: 0,           // Offset (em px) do ponto de trigger original
        delay: 0,            // Valores de 0 a 3000, com passo de 50ms
        duration: 800,       // Valores de 0 a 3000, com passo de 50ms
        easing: 'ease-in-out', // Easing padrão para animações AOS
        once: true,          // Se a animação deve acontecer apenas uma vez
        mirror: false,       // Se os elementos devem se animar quando saem da viewport
        anchorPlacement: 'top-bottom', // Define qual posição do elemento em relação à viewport deve disparar a animação
        
        // Configurações de responsividade
        disable: false,      // Aceita as seguintes condições: 'phone', 'tablet', 'mobile', boolean, expression ou function
        startEvent: 'DOMContentLoaded', // Nome do evento disparado no document
        
        // Configurações para uma experiência mais suave
        throttleDelay: 99,   // Delay no throttle usado no scroll listener em ms
        debounceDelay: 50,   // Delay no debounce usado no resize listener em ms
    });
});
