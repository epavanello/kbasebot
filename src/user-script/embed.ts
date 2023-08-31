"use client"

import {getChatbotPublicId} from "@/modules/chatbots/helpers";

export class ChatbotEmbed {
    private shadowRoot: ShadowRoot | null = null;
    private chatbotContainer: HTMLElement;
    private chatbotIcon: HTMLElement;
    private chatbot_id: string;

    constructor(chatbot_id: string) {
        this.chatbot_id = chatbot_id;
        if (!chatbot_id) {
            throw new Error('chatbot id is required');
        }

        // Create a container for the chatbot
        this.chatbotContainer = document.createElement('div');
        this.chatbotContainer.style.position = 'fixed';
        this.chatbotContainer.style.bottom = '20px';
        this.chatbotContainer.style.right = '20px';
        this.chatbotContainer.style.zIndex = '999';

        // Create and style the chatbot icon
        this.chatbotIcon = document.createElement('div');
        this.chatbotIcon.style.position = 'fixed';
        this.chatbotIcon.style.bottom = '20px';
        this.chatbotIcon.style.right = '20px';
        this.chatbotIcon.style.zIndex = '1000';
        this.chatbotIcon.style.padding = '10px';
        this.chatbotIcon.style.border = '1px solid green';
        this.chatbotIcon.style.borderRadius = '50%';
        this.chatbotIcon.style.cursor = 'pointer';
        this.setChatbotIcon(); // Set initial icon

        document.body.appendChild(this.chatbotContainer);
        document.body.appendChild(this.chatbotIcon);

        this.chatbotIcon.addEventListener('click', () => {
            if (this.shadowRoot) {
                this.closeChatbot();
            } else {
                this.openChatbot();
            }
        });
    }

    setChatbotIcon(isOpen: boolean = false) {
        if (isOpen) {
            this.chatbotIcon.innerHTML = `<div style="display:flex; justify-content:center; align-items:center;
width:45px; height:45px; font-size: 44px;"><span>×</span></div>`;
        } else {
            this.chatbotIcon.innerHTML = `<img src="/bot.svg" style="width:45px; height:45px;" />`;
        }
    }

    openChatbot() {
        this.setChatbotIcon(true);
        if (!this.shadowRoot) {
            this.shadowRoot = this.chatbotContainer.attachShadow({ mode: 'open' });
            this.render();
        }
        const iframe = this.shadowRoot?.querySelector('iframe');
        if (iframe) {
            iframe.style.transform = 'scale(1)';
            iframe.style.opacity = '1';
            iframe.style.display = 'block';
        }
    }

    closeChatbot() {
        this.setChatbotIcon(false);
        const iframe = this.shadowRoot?.querySelector('iframe');
        if (iframe) {
            iframe.style.opacity = '0';
            setTimeout(() => {
                iframe.style.display = 'none';
            }, 300);
        }
    }

    render() {
        if (!this.shadowRoot) return;

        const chatbotURL = getChatbotPublicId(this.chatbot_id);

        const iframe = document.createElement('iframe');
        iframe.src = chatbotURL;
        iframe.style.width = '350px';
        iframe.style.height = '650px';
        iframe.frameBorder = '0';
        iframe.style.transform = 'scale(0.8)';
        iframe.style.opacity = '0';
        iframe.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        iframe.style.display = 'none';
        iframe.style.position = 'absolute';
        iframe.style.bottom = '70px';
        iframe.style.right = '20px';

        this.shadowRoot.appendChild(iframe);

        const style = document.createElement('style');
        style.textContent = `
            /* Add your styles here */
        `;
        this.shadowRoot.appendChild(style);
    }
}
