import {slackBlocksToPlainText, toJSON} from "@/app/api/integrations/slack/helper";



export const sendSlackMsg = async (event, msg) => {
    const headers = {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        "Content-type": "application/json",
    };

    let raw = {
        channel: `${event.channel}`,
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text:msg,
                },
            },
            // {
            //     type: "context",
            //     elements: [
            //         {
            //             type: "mrkdwn",
            //             text: `*<@${event.user}>* wanted me to introduce myself.`,
            //         },
            //     ],
            // },
        ],
        // text: "Hello, I'm Mr. Meeseeks! Look at me!",
    };

    const requestOptions = {
        method: "POST",
        headers,
        body: JSON.stringify(raw),
    };

    await fetch(
        `https://slack.com/api/chat.postMessage`,
        requestOptions
    );
}

let temp_message_id = '';

export const runSlackApp = async (data) => {

    const event = data?.event || {}

    const {channel_type, blocks, client_msg_id} = event

    if(channel_type === 'im' && client_msg_id && client_msg_id !== temp_message_id){
        temp_message_id = client_msg_id
        const data = {
            "messages": [
                {
                    "role": "assistant",
                    "content": "Hello there! how can i help?"
                },
                {
                    "role": "user",
                    "content": slackBlocksToPlainText(blocks)
                },
            ],
            "conversationId": "7ce61de2-fb98-49fa-b0d7-d50e06f0a38a",
            "chatbotId": "d6e9a520-a6b2-4722-b983-db7fc8157228"
        }

        const rawResponse = await fetch(process.env.NEXT_PUBLIC_URL +'/api/chatbots/message', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        // const jsonData = await toJSON(rawResponse.body);
        const aiMesg = await rawResponse.text()

        await sendSlackMsg(event,aiMesg)
    }

}