import { Card } from 'antd';
import Account  from '../Account';

import './index.css'
import { useEffect, useState } from 'react';
import { User } from '../../../interfaces/user';
import { UsersDto } from '../../../interfaces/usersDto';
import { AuthJWT } from '../../../interfaces/auth';
import { accounts } from '../../../lib/accounts';
import { useCookies } from 'react-cookie';

const { getAllUsers } = accounts();

export default function AllAccounts() {
    const [users, setUsers] = useState<UsersDto>();
    const [loaded, setLoaded] = useState(false);
    const [cookies, setCookie] = useCookies();

    async function loadUsers() {
        const response = await getAllUsers(cookies.token);
        setUsers(response);
    }

    useEffect(() => {
        loadUsers();
    }, [])

    useEffect(() => {
        if (users !== undefined) {
            setLoaded(true);
        }
    }, [users])

    return (
        <div className='all-accounts'>
            <Card title={'All Accounts'}>
                { loaded && users !== undefined &&
                    users.data.map((user: User) => <Account user={user} key={user.id} />)
                }
                
            </Card>
        </div>
    )
}