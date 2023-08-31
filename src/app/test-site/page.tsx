"use client"
import React, {useEffect} from 'react';
import {ChatbotEmbed} from "@/user-script/embed";

const Page = () => {

    useEffect(()=> {
        new ChatbotEmbed('s')
    },[])

    return (
        <div className="flex justify-center items-center w-full h-screen">
            <h1 className="text-7xl font-black text-primary">Test Site</h1>
        </div>
    );
};

export default Page;