/* Form handling: validation, visual mask for WhatsApp, and webhook send (JSON)
     - Edit WEBHOOK_URL to point to your n8n webhook
*/
(function () {
    'use strict';

    // CHANGE THIS to your n8n webhook URL
    const WEBHOOK_URL = 'https://n8n.unitycompany.com.br/webhook/form-fasthomes-lp';

    const form = document.querySelector('.contactForm');
    if (!form) return;

    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const telInput = form.querySelector('#tel');

    // Small helpers
    const onlyDigits = (s) => (s || '').replace(/\D+/g, '');

    // UTM capture
    const UTM_STORAGE_KEY = 'lp_utms';

    function getUTMParamsFromURL() {
        const params = new URLSearchParams(window.location.search);
        const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'];
        const utms = {};
        keys.forEach(k => {
            const v = params.get(k);
            if (v) utms[k] = v;
        });
        return utms;
    }

    function storeUTMsIfPresent() {
        try {
            const utms = getUTMParamsFromURL();
            if (Object.keys(utms).length > 0) {
                const payload = {
                    utms,
                    capturedAt: new Date().toISOString(),
                    url: window.location.href,
                };
                sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(payload));
            }
        } catch (err) {
            // ignore storage errors
            console.warn('UTM store failed', err);
        }
    }

    function getStoredUTMs() {
        try {
            const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (err) {
            return null;
        }
    }

    // Capture UTMs on load if present
    storeUTMsIfPresent();

    // Format phone while typing: (##) #####-#### for mobile (11 digits)
    function formatWhatsapp(value) {
        const digits = onlyDigits(value);
        if (!digits) return '';

        // If more than 11 digits, trim
        const d = digits.slice(0, 11);

        if (d.length <= 2) return '(' + d;
        if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
        if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
        // 11 digits (mobile): (AA) 9XXXX-XXXX
        return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
    }

    // Validation functions
    function validateName() {
        const v = (nameInput.value || '').trim();
        if (!v) {
            nameInput.setCustomValidity('Por favor insira seu nome.');
            return false;
        }
        if (v.length < 3) {
            nameInput.setCustomValidity('Digite pelo menos 3 caracteres para o nome.');
            return false;
        }
        // Allow letters, accents, spaces, hyphen and apostrophe
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-]+$/.test(v)) {
            nameInput.setCustomValidity('Nome contém caracteres inválidos.');
            return false;
        }
        nameInput.setCustomValidity('');
        return true;
    }

    function validateEmail() {
        const v = (emailInput.value || '').trim();
        if (!v) {
            emailInput.setCustomValidity('Por favor insira um e-mail.');
            return false;
        }
        // Basic email regex
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(v)) {
            emailInput.setCustomValidity('E-mail inválido.');
            return false;
        }
        emailInput.setCustomValidity('');
        return true;
    }

    function validateTel() {
        const raw = onlyDigits(telInput.value);
        // Require exactly 11 digits for Brazilian mobile (including leading 9)
        if (!raw) {
            telInput.setCustomValidity('Por favor insira seu WhatsApp.');
            return false;
        }
        if (raw.length !== 11) {
            telInput.setCustomValidity('Digite um número de WhatsApp com 11 dígitos (ex: (24) 98141-4122).');
            return false;
        }
        // Optionally ensure third digit (first of subscriber) is 9 (common for BR mobiles)
        if (raw[2] !== '9') {
            telInput.setCustomValidity('Número de celular inválido: verifique se está correto.');
            return false;
        }
        telInput.setCustomValidity('');
        return true;
    }

    // Visual helpers: show native validation messages when invalid
    function reportInvalids() {
        // The browser will show messages with reportValidity()
        return form.reportValidity();
    }

    // Masking behavior for tel input
    telInput.addEventListener('input', (e) => {
        const cursorPos = telInput.selectionStart;
        const before = telInput.value;
        const formatted = formatWhatsapp(before);
        telInput.value = formatted;
        // Try to keep cursor near the end (best-effort)
        try {
            telInput.setSelectionRange(telInput.value.length, telInput.value.length);
        } catch (err) {
            // ignore
        }
        // clear custom validity while typing
        telInput.setCustomValidity('');
    });

    // Validate on blur and on input for nicer UX
    nameInput.addEventListener('input', () => { nameInput.setCustomValidity(''); });
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('input', () => { emailInput.setCustomValidity(''); });
    emailInput.addEventListener('blur', validateEmail);
    telInput.addEventListener('blur', validateTel);

    // Build payload and send to webhook
    async function sendWebhook(payload) {
        try {
            const res = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            return res;
        } catch (err) {
            console.error('Erro ao enviar webhook:', err);
            throw err;
        }
    }

    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();

        // run validations
        const okName = validateName();
        const okEmail = validateEmail();
        const okTel = validateTel();

        if (!okName || !okEmail || !okTel) {
            reportInvalids();
            return;
        }

        // Prepare data
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const telDigits = onlyDigits(telInput.value);
        const telMasked = formatWhatsapp(telInput.value);

        const payload = {
            name,
            email,
            whatsapp: '+55' + telDigits, // E.164 style for Brazil
            whatsapp_raw: telDigits,
            whatsapp_masked: telMasked,
            referrer: document.referrer || null,
            submittedAt: new Date().toISOString(),
            source: window.location.href,
        };

        // If UTMs were captured, add each UTM as a separate top-level field
        const stored = getStoredUTMs();
        if (stored && stored.utms) {
            const utmObj = stored.utms;
            // expected keys: utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid
            Object.keys(utmObj).forEach(k => {
                // only add if value exists
                if (utmObj[k]) payload[k] = utmObj[k];
            });
            // also add captured metadata
            if (stored.capturedAt) payload.utm_captured_at = stored.capturedAt;
            if (stored.url) payload.utm_source_url = stored.url;
        }

        // Optional: disable submit button to avoid duplicates
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        let sendSucceeded = false;
        try {
            const res = await sendWebhook(payload);
            if (res && res.ok) {
                sendSucceeded = true;
                alert('Mensagem enviada com sucesso! Em breve um consultor entrará em contato.');
                form.reset();

                // update only the inner span text/color; keep button styles intact
                if (submitBtn) {
                    const span = submitBtn.querySelector('span');
                    const icon = submitBtn.querySelector('img');

                    // Smoothly update span text and color
                    if (span) {
                        span.style.transition = 'color 220ms ease, opacity 220ms ease, transform 220ms ease';
                        span.style.opacity = '0.6';
                        setTimeout(() => {
                            span.textContent = 'Formulário enviado com sucesso!';
                            span.style.color = '#1d1d1b';
                            span.style.backgroundColor = '#1d1d1b00';
                            span.style.fontWeight = '500';
                            span.style.border = '1px solid #1d1d1b';
                            span.style.opacity = '1';
                            span.style.cursor = 'not-allowed';
                        }, 120);
                    }

                    // Smooth icon swap: fade out -> change src -> fade in
                    if (icon) {
                        icon.style.transition = 'opacity 180ms ease, transform 180ms ease';
                        icon.style.opacity = '0';
                        icon.style.transform = 'scale(0.85)';
                        setTimeout(() => {
                            // swap to check icon
                            icon.src = 'src/assets/icons/check-line.svg';
                            icon.alt = 'icon-check';
                            // ensure it fades back in
                            // use onload to be safe
                            icon.onload = () => {
                                icon.style.opacity = '1';
                                icon.style.transform = 'scale(1)';
                            };
                            // fallback in case onload doesn't fire quickly
                            setTimeout(() => {
                                icon.style.opacity = '1';
                                icon.style.transform = 'scale(1)';
                            }, 100);
                        }, 180);
                    }

                    submitBtn.disabled = true;
                    // reduce pointer interactions
                    submitBtn.style.cursor = 'default';
                }
            } else {
                // server returned error
                const errText = res ? await res.text().catch(() => '') : '';
                console.error('Webhook retornou erro', res && res.status, errText);
                alert('Não foi possível enviar. Tente novamente mais tarde.');
            }
        } catch (err) {
            console.error('Erro ao enviar webhook:', err);
            alert('Erro de rede ao enviar o formulário.');
        } finally {
            // only re-enable if send did not succeed
            if (submitBtn && !sendSucceeded) submitBtn.disabled = false;
        }
    });

})();

