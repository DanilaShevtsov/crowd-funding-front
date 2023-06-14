import { Button, Card } from "antd";
import { User } from "../../../interfaces/user";
import { accounts } from "../../../lib/accounts";
import './index.css'
import { useState } from "react";

interface ComplaintProps {
    company: string,
    children: any[]
}

const { banUser, unbanUser } = accounts();


export default function Complaint({ company, children }: ComplaintProps) {

    return (
        <Card className="account" type="inner" title={company}>
            {children.map((child) => {
                return <div className="account-complaint" key={child.id}>
                <span>Complaint</span>
                <span><b>From: {child.user.pubKey}</b></span>
                <span
                    style={{ border: '0.5px solid black', padding: '10px' }}
                >{child.complaint}</span>
                <Button
                    style={{ flexBasis: '10%', alignSelf: 'flex-end', width: '30%' }}
                >Close Complaint</Button>
            </div>
            })}
            
        </Card>
    )
}