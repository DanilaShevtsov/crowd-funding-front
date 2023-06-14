import { Card } from 'antd';
import Complaint  from '../Complaint';

import './index.css'
import { useEffect, useState } from 'react';
import { User } from '../../../interfaces/user';
import { UsersDto } from '../../../interfaces/usersDto';
import { AuthJWT } from '../../../interfaces/auth';
import { accounts } from '../../../lib/accounts';
import { useCookies } from 'react-cookie';
import { complaintsLib } from '../../../lib/complaints';

const { getAllUsers } = accounts();
const { getAllComplaints } = complaintsLib();

export default function AllComplaints() {
    const [users, setUsers] = useState<UsersDto>();
    const [listOfComplaints, setListOfComplaints] = useState<any>();
    const [loaded, setLoaded] = useState(false);
    const [cookies, setCookie] = useCookies();

    async function loadComplaints() {
        const rawComplaints = await getAllComplaints(cookies.token as string);
        let companiesWithComplaints: any = {};
        for (const complaint of rawComplaints) {
            if (!companiesWithComplaints[complaint.company.name]) {
                companiesWithComplaints[complaint.company.name] = []
            }
            companiesWithComplaints[complaint.company.name].push(complaint)
        }
        console.log(companiesWithComplaints)
        setListOfComplaints(companiesWithComplaints)
    }

    async function loadUsers() {
        const response = await getAllUsers(cookies.token);
        setUsers(response);
    }

    useEffect(() => {
        loadUsers();
    }, [])

    useEffect(() => {
        if (listOfComplaints) {
            setLoaded(true);
        }
    }, [listOfComplaints])

    useEffect(() => {
        loadComplaints();
    }, [])

    useEffect(() => {
        if (users !== undefined) {
            setLoaded(true);
        }
    }, [users])

    return (
        <div className='all-accounts'>
            <Card title={'All Complaints'}>
                    { loaded && listOfComplaints &&
                         Object.keys(listOfComplaints).map((company) => <Complaint company={company} children={listOfComplaints[company]} />)
                    }
            </Card>
        </div>
    )
}