import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";

export const loadText = async (text) => {
    const splitter = new RecursiveCharacterTextSplitter();

    return splitter.createDocuments([text]);
}