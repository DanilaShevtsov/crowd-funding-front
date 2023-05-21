import { Card } from 'antd';
import Complaint  from '../Complaint';

import './index.css'
import { useEffect, useState } from 'react';
import { User } from '../../../interfaces/user';
import { UsersDto } from '../../../interfaces/usersDto';
import { AuthJWT } from '../../../interfaces/auth';
import { accounts } from '../../../lib/accounts';

interface AllComplaintsProps {
    token: AuthJWT;
}

const { getAllUsers } = accounts();

export default function AllComplaints({ token }: AllComplaintsProps) {
    const [users, setUsers] = useState<UsersDto>();
    const [loaded, setLoaded] = useState(false);

    async function loadUsers() {
        const response = await getAllUsers(token.token);
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
            <Card title={'All Complaints'}>
            <Complaint title={'Test Company 1'} complaint={'Я хочу поделиться своим негативным опытом с пользователем краудфандинговой платформы. Он не только не выполнил обещания, но и не отвечал на мои сообщения и звонки. Я вложил в его проект значительную сумму денег и теперь чувствую себя обманутым. Я надеюсь, что администрация платформы примет меры по защите прав инвесторов и предотвратит подобные случаи в будущем.'} from={'0x5F5153c5642d88d7d1f36198697dbf76c75273d6'} token={token} />
            <Complaint title={'Test Company 2'} complaint={'Я хочу выразить свою глубокую обиду и разочарование по поводу проекта, на который я вложил значительную сумму денег через краудфандинговую платформу. Обещания создателя проекта не были выполнены, а он не отвечал на мои сообщения и звонки. Я чувствую себя обманутым и недовольным тем, как были обращены с моими инвестициями. Я надеюсь, что администрация платформы проведет расследование и примет меры по защите прав инвесторов, чтобы подобные случаи не повторились в будущем.'} from={'0x4776Ec9158a37948a2aA42F5180fB0468D46F700'} token={token} />
            <Complaint title={'Test Company 3'} complaint={'Я очень расстроен и обижен на создателя краудфандингового проекта, в который я вложил значительную сумму денег. Обещания, данного им ранее, не были выполнены, а он не отвечал на мои сообщения и звонки. Я чувствую себя обманутым и недовольным тем, как были обращены с моими инвестициями. Я надеюсь, что администрация платформы проведет расследование и примет меры по защите прав инвесторов, чтобы подобные случаи не повторились в будущем.'} from={'0x16f93765e1B473a4AbcA9c868fc55B39E93e4f5E'} token={token} />
            <Complaint title={'Test Company 4'} complaint={'Уважаемая администрация краудфандинговой платформы, я обращаюсь к вам с жалобой на создателя проекта, в который я вложил большую сумму денег. К сожалению, обещания, данного им ранее, не были выполнены, а он не отвечал на мои сообщения и звонки. Я чувствую себя обманутым и недовольным тем, как были обращены с моими инвестициями. Я надеюсь, что вы проведете расследование и примете меры по защите прав инвесторов, чтобы подобные случаи не повторились в будущем. Благодарю за внимание.'} from={'0x20498Db09c78075BC2fE28af5fBE4EaAB878fff4'} token={token} />
            </Card>
        </div>
    )
}