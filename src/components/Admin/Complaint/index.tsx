import { Button, Card } from "antd";
import { User } from "../../../interfaces/user";
import { accounts } from "../../../lib/accounts";
import './index.css'
import { useState } from "react";

interface ComplaintProps {
    title: string;
    complaint: string;
    from: string
}

const { banUser, unbanUser } = accounts();


export default function Complaint({ title, complaint, from }: ComplaintProps) {

    return (
        <Card className="account" type="inner" title={title}>
            
            <div className="account-complaint">
                <span>Complaint</span>
                <span><b>From: {from}</b></span>
                <span
                    style={{ border: '0.5px solid black', padding: '10px' }}
                >{complaint}</span>
                <Button
                    style={{ flexBasis: '10%', alignSelf: 'flex-end', width: '30%' }}
                >Close Complaint</Button>
            </div>
        </Card>
    )
}