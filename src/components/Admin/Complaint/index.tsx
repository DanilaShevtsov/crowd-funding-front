import { Button, Card } from "antd";
import { User } from "../../../interfaces/user";
import { accounts } from "../../../lib/accounts";
import './index.css'
import { useState } from "react";
import { complaintsLib } from "../../../lib/complaints";
import { useCookies } from "react-cookie";

interface ComplaintProps {
    company: string,
    children: any[]
    onClose: () => void
}

const { removeComplaint } = complaintsLib();


export default function Complaint({ company, children, onClose }: ComplaintProps) {
    const [cookies, setCookie] = useCookies();

    async function closeComplaint(complaintID:string) {
        await removeComplaint(cookies.token, complaintID);
        onClose();
    }

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
                    onClick={() => {closeComplaint(child.id)}}
                >Close Complaint</Button>
            </div>
            })}
            
        </Card>
    )
}