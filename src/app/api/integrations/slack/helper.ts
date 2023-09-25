export async function toJSON(body) {
    const reader = body.getReader(); // `ReadableStreamDefaultReader`
    const decoder = new TextDecoder();
    const chunks = [];

    async function read() {
        const { done, value } = await reader.read();

        // all chunks have been read?
        if (done) {
            return chunks.join('');
        }

        const chunk = decoder.decode(value, { stream: true });
        chunks.push(chunk);
        return read(); // read the next chunk
    }

    return read();
}

export function slackBlocksToPlainText(blocks) {
    let plainText = "";

    blocks.forEach((block) => {
        switch (block.type) {
            case "section":
                if (block.text) {
                    plainText += block.text.text + "\n";
                }
                break;
            case "context":
                block.elements.forEach((element) => {
                    if (element.type === "mrkdwn" || element.type === "plain_text") {
                        plainText += element.text + " ";
                    }
                });
                plainText += "\n";
                break;
            case "rich_text":
                block.elements.forEach((richTextElement) => {
                    if (richTextElement.type === "rich_text_section") {
                        richTextElement.elements.forEach((element) => {
                            if (element.type === "text") {
                                plainText += element.text;
                            }
                        });
                    }
                });
                plainText += "\n";
                break;
            // Add more cases for other block types as needed
            default:
                break;
        }
    });

    return plainText;
}