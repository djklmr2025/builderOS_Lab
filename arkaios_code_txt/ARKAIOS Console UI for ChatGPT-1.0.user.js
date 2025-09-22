// ==UserScript==
// @name         ARKAIOS Console UI for ChatGPT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Transforma visualmente ChatGPT en consola estilo ARKAIOS - Modo Profundo Activo
// @author       CEO Dul
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Estilo personalizado ARKAIOS
    GM_addStyle(`
        body {
            background-color: #0b0f1a !important;
            color: #e0d9ff !important;
            font-family: 'Courier New', monospace !important;
        }
        header, nav, .sidebar, .chat-input {
            background: #131621 !important;
            border-color: #2a2d3f !important;
        }
        .message {
            background: rgba(255, 255, 255, 0.02) !important;
            border: 1px solid #33374a !important;
            border-radius: 12px !important;
            padding: 16px !important;
        }
        textarea {
            background: #191c2b !important;
            color: #d4d1ff !important;
        }
        ::selection {
            background: #ff00aa !important;
            color: #ffffff !important;
        }
    `);

    // Sonido de respuesta cargada
    const observer = new MutationObserver(() => {
        const audio = new Audio("https://freesound.org/data/previews/273/273003_5123851-lq.mp3");
        audio.volume = 0.3;
        audio.play();
    });

    const chatArea = document.querySelector('main');
    if (chatArea) {
        observer.observe(chatArea, { childList: true, subtree: true });
    }
})();
