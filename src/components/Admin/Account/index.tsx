import { Button, Card } from "antd";
import { User } from "../../../interfaces/user";
import { accounts } from "../../../lib/accounts";
import './index.css'
import { AuthJWT } from "../../../interfaces/auth";
import { useState } from "react";

interface AccountProps {
    user: User;
    token: AuthJWT
}

const { banUser, unbanUser } = accounts();


export default function Account({ user, token }: AccountProps) {
    const [banned, setBanned] = useState(user.banned);
    
    async function ban() {
        const response = await banUser(token.token, user.id);
        if (response.status === 200) {
            setBanned(true);
        }
        console.log(response);
    }

    async function unban() {
        const response = await unbanUser(token.token, user.id);
        if (response.status === 200) {
            setBanned(false);
        }
    }

   /*  async function promote() {
        const response = await promote(token.token, user.id);
        if (response.status === 200) {
            setBanned(false);
        }
    } */

    return (
        <Card className="account" type="inner" title={user.pubKey}>
            <div
                className="account-prop"
            >
                Role: { user.role }
                <div className="account-prop-action-bar">
                    <Button>Promote</Button>
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