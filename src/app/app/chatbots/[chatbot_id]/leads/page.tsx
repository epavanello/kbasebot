import React from 'react';
import {DashboardHeader} from "@/components/ui/dashboard-header";
import {DashboardShell} from "@/components/ui/dashboard-shell";
import {Button} from "@/components/ui/button";

const LeadsPage = () => {
    return (
        <DashboardShell className="container max-w-3xl">
            <DashboardHeader heading={"Leads"} >
                <Button>
                    Settings
                </Button>
            </DashboardHeader>

        </DashboardShell>
    );
};

export default LeadsPage;