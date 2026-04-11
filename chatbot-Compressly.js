// 🤖 ==========================================
// MÓDULO MAESTRO: NEO-GLASS AI CHATBOT (TODO EN UNO)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // 🎨 1. INYECTAR ESTILOS (CSS)
    const botStyle = document.createElement('style');
    botStyle.innerHTML = `
:root {
    --bot-width: 400px;
    --bot-height: 600px;
    --bot-right: 30px;
    --bot-bottom: 110px;
    --ai-glow: #8B5CF6;
    --ai-accent: #C084FC;
    --glass-bg: rgba(20, 20, 23, 0.85);
    --glass-border: rgba(255, 255, 255, 0.1);
    --text-main: #FFFFFF;
    --text-muted: #9CA3AF;
}

html:not(.dark) {
    --glass-bg: rgba(255, 255, 255, 0.95);
    --glass-border: rgba(0, 0, 0, 0.1);
    --text-main: #111827;
    --text-muted: #6B7280;
}

html:not(.dark) .ai-toggler {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(139, 92, 246, 0.3);
}

html:not(.dark) .ai-core,
html:not(.dark) .msg-avatar {
    background: radial-gradient(circle, #F5F3FF 0%, #A78BFA 60%, #8B5CF6 100%);
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.4);
}

html:not(.dark) .close-icon {
    color: #8B5CF6;
}

.ai-toggler {
    position: fixed;
    bottom: 30px;
    right: var(--bot-right);
    width: 64px;
    height: 64px;
    border-radius: 24px;
    border: 1px solid rgba(139, 92, 246, 0.4);
    background: rgba(15, 15, 20, 0.8);
    backdrop-filter: blur(10px);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    transform: scale(0.5) translateY(50px);
    pointer-events: none;
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.2), inset 0 0 15px rgba(139, 92, 246, 0.1);
}

.ai-toggler.show-bot {
    opacity: 1;
    transform: scale(1) translateY(0);
    pointer-events: auto;
}

.ai-toggler:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.6), inset 0 0 20px rgba(139, 92, 246, 0.3);
    border-color: rgba(139, 92, 246, 0.8);
}

.ai-core {
    width: 28px;
    height: 28px;
    background: radial-gradient(circle, #E9D5FF 0%, #8B5CF6 60%, #4C1D95 100%);
    border-radius: 50%;
    box-shadow: 0 0 15px var(--ai-glow);
    animation: breathe 3s infinite ease-in-out;
    transition: all 0.3s;
}

@keyframes breathe {
    0%,
    100% {
        transform: scale(1);
        box-shadow: 0 0 15px var(--ai-glow);
    }
    50% {
        transform: scale(1.2);
        box-shadow: 0 0 25px var(--ai-accent);
    }
}

.close-icon {
    display: none;
    color: white;
    font-size: 24px;
}

body.chat-active .ai-core {
    display: none;
}

body.chat-active .close-icon {
    display: block;
}

.ai-chat-window {
    position: fixed;
    right: var(--bot-right);
    bottom: var(--bot-bottom);
    width: var(--bot-width);
    height: var(--bot-height);
    max-height: 80vh;
    background: var(--glass-bg);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 9998;
    opacity: 0;
    pointer-events: none;
    transform: translateY(20px) scale(0.95);
    transform-origin: bottom right;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

body.chat-active .ai-chat-window {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0) scale(1);
}

.ai-header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--glass-border);
    display: flex;
    align-items: center;
    gap: 16px;
    background: linear-gradient(180deg, rgba(139, 92, 246, 0.1) 0%, transparent 100%);
}

.header-avatar {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid var(--glass-border);
    display: flex;
    align-items: center;
    justify-content: center;
}

.header-info h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--text-main);
}

.header-info p {
    margin: 4px 0 0 0;
    font-size: 0.85rem;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 6px;
}

.status-pulse {
    width: 8px;
    height: 8px;
    background: #10B981;
    border-radius: 50%;
    box-shadow: 0 0 8px #10B981;
}

.ai-chatbox {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    scroll-behavior: smooth;
}

.msg-incoming {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    animation: slideUp 0.4s ease forwards;
}

.msg-avatar {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    background: radial-gradient(circle, #E9D5FF 0%, #8B5CF6 60%, #4C1D95 100%);
    border-radius: 50%;
    border: none;
    box-shadow: 0 0 15px var(--ai-glow);
    animation: breathe 3s infinite ease-in-out;
}

.msg-bubble {
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid var(--glass-border);
    padding: 16px 20px;
    border-radius: 4px 18px 18px 18px;
    color: var(--text-main);
    font-size: 0.95rem;
    line-height: 1.5;
    max-width: 90%;
}

.typing-box {
    display: flex;
    gap: 6px;
    padding: 12px 16px;
    width: fit-content;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid var(--glass-border);
    border-radius: 4px 18px 18px 18px;
    margin-left: 48px;
}

.dot {
    width: 6px;
    height: 6px;
    background: var(--ai-accent);
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(1) {
    animation-delay: -0.32s;
}

.dot:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes bounce {
    0%,
    80%,
    100% {
        transform: translateY(0);
        opacity: 0.4;
    }
    40% {
        transform: translateY(-4px);
        opacity: 1;
        box-shadow: 0 0 5px var(--ai-accent);
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 480px) {
    .ai-chat-window {
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 0;
        border: none;
        max-height: 100vh;
        z-index: 100000;
    }

    .ai-header {
        padding-top: 15px;
    }

    .ai-toggler {
        bottom: 20px;
        right: 20px;
        z-index: 100001;
    }
}

body.chat-active.mobile-no-scroll {
    overflow: hidden;
}
    `;
    document.head.appendChild(botStyle);

    // 🏗️ 2. INYECTAR ESTRUCTURA (HTML)
    const botWrapper = document.createElement('div');
    botWrapper.innerHTML = `
    <button class="ai-toggler" id="aiToggler" aria-label="Abrir asistente">
        <div class="ai-core"></div>
        <svg class="close-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    </button>

    <div class="ai-chat-window">
        <header class="ai-header">
        <div class="header-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-500">
                <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
            </svg>
        </div>
        <div class="header-info">
            <h2 data-i18n="bot_title">Asistente Virtual</h2>
            <p><span class="status-pulse"></span> <span data-i18n="bot_status">Sistema en línea</span></p>
        </div>
    </header>

        <div class="ai-chatbox" id="aiChatbox"></div>
    </div>
    `;
    document.body.appendChild(botWrapper);

    // 🧠 3. CEREBRO Y LÓGICA (JS)
    const aiToggler = document.getElementById('aiToggler');
    const aiChatbox = document.getElementById('aiChatbox');
    let aiStarted = false;

    const handleScrollAI = () => {
        if (window.scrollY > 100) {
            // ✅ Aparece si bajamos más de 100px
            aiToggler.classList.add('show-bot');
        } else {
            // ✅ Desaparece si volvemos arriba (0 - 100px)
            aiToggler.classList.remove('show-bot');
        }
    };
    window.addEventListener('scroll', handleScrollAI);
    handleScrollAI();

    aiToggler.addEventListener('click', () => {
        document.body.classList.toggle('chat-active');

        if (window.innerWidth <= 480) {
            document.body.classList.toggle('mobile-no-scroll');
        }

        if (!aiStarted && document.body.classList.contains('chat-active')) {
            aiStarted = true;
            if (window.triggerVibration) window.triggerVibration(20);

            const typing = document.createElement('div');
            typing.className = 'typing-box';
            typing.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
            aiChatbox.appendChild(typing);

            setTimeout(() => {
                typing.remove();
                if (window.triggerVibration) window.triggerVibration([20, 30]);

                const msgDiv = document.createElement('div');
                msgDiv.className = 'msg-incoming';
                const lang = (typeof currentLanguage !== 'undefined') ? currentLanguage : 'es';
                const saludo = translations[currentLanguage].bot_welcome;

                msgDiv.innerHTML = `
                    <div class="msg-avatar"></div>
                    <div class="msg-bubble" data-i18n="bot_welcome">${saludo}</div>
                `;
                aiChatbox.appendChild(msgDiv);
            }, 1500);
        } else {
            if (window.triggerVibration) window.triggerVibration(10);
        }
    });
});