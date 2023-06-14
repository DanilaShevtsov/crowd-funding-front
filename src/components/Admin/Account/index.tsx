import { Button, Card } from "antd";
import { User } from "../../../interfaces/user";
import { accounts } from "../../../lib/accounts";
import './index.css'
import { AuthJWT } from "../../../interfaces/auth";
import { useState } from "react";
import { useCookies } from "react-cookie";

interface AccountProps {
    user: User;
}

const { banUser, unbanUser, promote } = accounts();


export default function Account({ user }: AccountProps) {
    const [banned, setBanned] = useState(user.banned);
    const [role, setRole] = useState(user.role);
    const [cookies, setCookie] = useCookies();
    
    async function ban() {
        const response = await banUser(cookies.token, user.id);
        if (response.status === 200) {
            setBanned(true);
        }
        console.log(response);
    }

    async function unban() {
        const response = await unbanUser(cookies.token, user.id);
        if (response.status === 200) {
            setBanned(false);
        }
    }

    async function improve() {
        const response:any = await promote(cookies.token, user.id);
        console.log(response)
        if (response.status === 200) {
            setRole("admin");
        }
    }

   /*  async function promote() {
        const response = await promote(cookies.token, user.id);
        if (response.status === 200) {
            setBanned(false);
        }
    } */

    return (
        <Card className="account" type="inner" title={user.pubKey}>
            <div
                className="account-prop"
            >
                Role: { role }
                <div className="account-prop-action-bar">
                    <Button onClick={improve}>Promote</Button>
                </div>
            </div>
            <hr/>
            <div
                className="account-prop"
            >
                Banned: { banned.toString() }
                <div className="account-prop-action-bar">
                    {!banned && <Button danger onClick={ban}>Ban</Button>}
                    {banned && <Button className="positive-button" onClick={unban}>Unban</Button>}
                </div>
            </div>
            <hr/>
            <div
                className="account-prop"
            >
                AML status: Checked
                <div className="account-prop-action-bar">
                    <Button className="positive-button" onClick={unban}>Check AML</Button>
                </div>
            </div>
        </Card>
    )
}