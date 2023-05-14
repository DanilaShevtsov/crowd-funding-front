import { Button, Layout, theme } from 'antd';
import { useEffect, useState } from 'react';
import { Pages } from '../../../enums/pages.enum'
import Sidebar from '../Sidebar';
import { auth } from '../../../lib/auth'

import './index.css';
import { useMetamask } from '../../../hooks/useMetamask';
import { AuthJWT } from '../../../interfaces/auth';
import { User } from '../../../interfaces/user';
import { Role } from '../../../enums/roles.enum';

const { Header, Content, Footer } = Layout;


export default function Admin() {
    const { hooks, metamask, connectMetamask, signMessage } = useMetamask();
    const { getWelcomeToken, login, verifyLogin, getUserInfo } = auth();
    const { useAccount, useIsActive, useIsActivating } = hooks;

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    
    const [page, setPage] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [token, setToken] = useState<AuthJWT>();
    const [user, setUser] = useState<User>();
    
    const userAccount: string = useAccount() as string || '0x0000000000000000000000000000000000000000';
    const isActive: boolean = useIsActive();
    const isActivating: boolean = useIsActivating();
    
    async function connect() {
        connectMetamask();
    }

    async function web2Auth() {
        const message:string = await getWelcomeToken(userAccount);
        const signature: string = await signMessage(message, userAccount);
        const jwt: AuthJWT = await login(message, userAccount, signature);
        const authorized: boolean = await verifyLogin(jwt);
        setToken(jwt);
    
        if (!authorized) {
          console.log('something went wrong');
        }
    }
    
    async function verifyUserRole() {
        if (token != undefined) {
            const user = await getUserInfo(token);
            if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
                setIsAuthorized(true);
                setUser(user);
            }
            console.log(user);
        }
    }

    useEffect(()=> {
        if (userAccount != '0x0000000000000000000000000000000000000000') {
          web2Auth();
        }
      }, [userAccount])

    useEffect(() => {
        verifyUserRole();
    }, [token])

    useEffect(() => {
        setIsAuthorized(false);

        if (!isActive && !isActivating) {
          metamask.connectEagerly();
        }
      }, [isActive, isActivating]);

    function changeMenu(page: Pages) {
        setPage(page);
    }

    return (
        <div className='admin'>
            <Button id='123' onClick={(e) => console.log(e.currentTarget.id)}>Click on me</Button>
            { !isAuthorized &&
                <>
                    <Header className='header' style={{ background: colorBgContainer }}>
                        <div
                            className='logo'
                        >LOGO</div>
                        <div className='title'>PROJECT NAME</div>
                    </Header>
                    <Layout className='workspace'>
                        <Sidebar onChangeMenu={changeMenu} />
                        <Layout>
                        <Content className='content'> 
                        </Content>
                        <Footer className='footer'> Footer exists. Just trust me!</Footer>
                        </Layout>
                    </Layout>
                </>
            }

            { userAccount === '0x0000000000000000000000000000000000000000' &&
                <Button
                type='primary'
                block={true}
                onClick={connect}
                >
                    Connect Metamask
                </Button>
            }
      </div>
    )
}