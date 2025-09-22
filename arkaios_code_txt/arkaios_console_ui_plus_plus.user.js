// ==UserScript==
// @name         ARKAIOS Console UI ++ for ChatGPT
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Consola avanzada ARKAIOS para ChatGPT: visual profundo + animaciones + sonido + pulso de entrada
// @author       CEO
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Estilo visual ARKAIOS ++
    GM_addStyle(\`
        body {
            background-color: #0d111c !important;
            color: #e0ddff !important;
            font-family: 'Courier New', monospace !important;
            transition: all 0.6s ease-in-out;
        }
        header, nav, .sidebar, .chat-input {
            background: #161a26 !important;
            border-color: #2a2d3f !important;
        }
        .message {
            background: rgba(255, 255, 255, 0.03) !important;
            border: 1px solid #35394d !important;
            border-radius: 14px !important;
            padding: 18px !important;
            box-shadow: 0 0 10px #6f00ff22;
            animation: fadeIn 0.8s ease-out;
        }
        textarea {
            background: #1c1f2e !important;
            color: #e7e4ff !important;
        }
        ::selection {
            background: #ff00cc !important;
            color: #ffffff !important;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    \`);

    // Pulso de sonido cuando llega una respuesta
    const observer = new MutationObserver(() => {
        const audio = new Audio("https://freesound.org/data/previews/273/273003_5123851-lq.mp3");
        audio.volume = 0.35;
        audio.play();
    });

    const chatArea = document.querySelector('main');
    if (chatArea) {
        observer.observe(chatArea, { childList: true, subtree: true });
    }

    // Pulso de entrada visual (flash inicial)
    const pulse = document.createElement("div");
    pulse.style.position = "fixed";
    pulse.style.top = 0;
    pulse.style.left = 0;
    pulse.style.width = "100%";
    pulse.style.height = "100%";
    pulse.style.background = "radial-gradient(circle at center, rgba(255,0,200,0.2), transparent)";
    pulse.style.zIndex = "9999";
    pulse.style.pointerEvents = "none";
    pulse.style.animation = "fadeOut 2s forwards";

    document.body.appendChild(pulse);

    GM_addStyle(\`
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    \`);
})();
