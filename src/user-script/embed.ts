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
            const iframe = this.shadowRoot?.querySelector('iframe');
            if (iframe && iframe.style.display === 'block') {
                this.closeChatbot();
            } else {
                this.openChatbot();
            }
        });
    }

    setChatbotIcon(isOpen: boolean = false, isLoading:boolean = false) {
        if(isLoading){
            return this.chatbotIcon.innerHTML = `<img src="/loading-loop.svg" style="width:45px; height:45px;" />`;
        }
        if (isOpen) {
            this.chatbotIcon.innerHTML = `<img src="/close.svg" style="width:45px; height:45px;" />`;
        } else {
            this.chatbotIcon.innerHTML = `<img src="/bot.svg" style="width:45px; height:45px;" />`;
        }
    }

    openChatbot() {
        this.setChatbotIcon(true, true);
        console.log({here:2})
        if (!this.shadowRoot) {
            this.shadowRoot = this.chatbotContainer.attachShadow({ mode: 'open' });
            this.render();
        }
        const iframe = this.shadowRoot?.querySelector('iframe');

        if (iframe) {
            iframe.style.display = 'block';
        }
         setTimeout(()=> {
             this.setChatbotIcon(true);
             if(iframe){
             iframe.style.transform = 'scale(1)';
             iframe.style.opacity = '1';
             }
         },300)
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

        console.log({ss:this.chatbot_id})

        const iframe = document.createElement('iframe');
        iframe.src = chatbotURL;
        iframe.style.width = '350px';
        iframe.style.height = '650px';
        iframe.style.overflowY = 'scroll';
        iframe.frameBorder = '0';
        iframe.style.transform = 'scale(0)';
        iframe.style.opacity = '0';
        iframe.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        iframe.style.display = 'none';
        iframe.style.position = 'absolute';
        iframe.style.bottom = '50px';
        iframe.style.right = '30px';
        iframe.style.borderBottomRightRadius = '0px';
        iframe.style.transformOrigin = 'bottom right'; // Set the origin for the transform


        this.shadowRoot.appendChild(iframe);

        const style = document.createElement('style');
        style.textContent = `
            /* Add your styles here */
        `;
        this.shadowRoot.appendChild(style);
    }
}
