import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Toggle} from "@/components/ui/toggle";
import {Icon} from "@/components/ui/icons";
import {cn} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {useSupabaseAuth} from "@/lib/store/use-user";
import {toast} from "@/components/ui/use-toast";
import {useParams} from "next/navigation";
import {Button} from "@/components/ui/button";

const LEADS_FIELDS= [
    {label: 'Name', field: 'name'},
    {label: 'Email', field: 'email'},
    {label: 'Phone Number', field: 'phone'},
]

const LeadsSettings = () => {
    const {chatbot_id} = useParams()
    const {supabase} = useSupabaseAuth()
    const [leadValues, setLeadValues] = useState({
        name: false,
        email: false,
        phone: false,
        confirmation_message: ''
    })

    const isLeadsEnabled = !!(leadValues.name || leadValues.email || leadValues.phone)

    useEffect(()=> {
        const getChatbotSettings = async () =>{

            const { data: chatbotSettings } = await supabase
                .from("chatbot_settings")
                .select("leads")
                .eq("chatbot_id", chatbot_id)
                .maybeSingle();


            if(chatbotSettings?.leads)
            setLeadValues(chatbotSettings?.leads)
        }

        if(chatbot_id) getChatbotSettings()
    }, [chatbot_id])



    const saveLeadSettings = async () => {
        try {
            await supabase.from('chatbot_settings').update({
                leads: leadValues
            }).eq('chatbot_id', chatbot_id)
                .throwOnError()

            toast({
                title: "👍 Leads settings updated",
            });
        }
        catch (e) {
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: "There was a problem with your request. please try again",
            });
            console.error(e)
        }
    }


    return (
        <Card id={'leads-settings'}>
            <CardHeader>
                <CardTitle>Leads Settings</CardTitle>
                <p>Collects leads from your chatbot</p>
                {!isLeadsEnabled && <p className={'text-primary text-xs p-1'}>Please select a field from below to enable lead's collection</p>}
            </CardHeader>
            <CardContent className="flex flex-col gap-6">

                <div className="flex gap-4">
                    {LEADS_FIELDS.map(item => {
                        const isActive = !!leadValues[item.field]


                        return <Toggle pressed={leadValues[item.field]} key={item.field} onPressedChange={(val) => {
                            setLeadValues({
                                ...leadValues,
                                [item.field]: val
                            })
                        }} variant="outline" aria-label="Toggle italic">
                            <div
                                className={cn('w-6 h-6 bg-secondary rounded-full border flex justify-center items-center mr-2', {
                                    "bg-primary text-secondary": isActive
                                })}>
                                {isActive && <Icon icon={'ph:check-bold'} className={cn('text-xs')}/>}
                            </div>
                            {item.label}</Toggle>;
                    })}
                </div>

                <div className="grid w-full gap-1.5">
                    <Label htmlFor="message-2">Confirmation message</Label>
                    <Textarea disabled={!isLeadsEnabled} onChange={e => {
                        setLeadValues({
                            ...leadValues,
                            confirmation_message: e.target.value
                        })
                    }} value={leadValues.confirmation_message} placeholder="eg. Thanks for reaching out! Our team will get back to you soon" />
                    <p className="text-sm text-muted-foreground">
                        This message will be shown once user input the data
                    </p>
                </div>


            </CardContent>
            <CardFooter>
                <Button onClick={saveLeadSettings}>
                    Update
                </Button>
            </CardFooter>
        </Card>
    );
};

export default LeadsSettings;