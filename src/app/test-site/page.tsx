"use client"
import React, {useEffect} from 'react';
import {ChatbotEmbed} from "@/user-script/embed";

const Page = () => {

    useEffect(()=> {
        new ChatbotEmbed('40d299e1-2893-4a08-ada3-1f8cc393ac46')
    },[])

    return (
        <div className="flex justify-center items-center w-full h-screen">
            <h1 className="text-7xl font-black text-primary">Test Site</h1>
        </div>
    );
};

export default Page;