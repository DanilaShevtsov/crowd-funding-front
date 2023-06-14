import { Button, Layout, theme } from 'antd';
import { useEffect, useState } from 'react';
import { Pages } from '../enums/pages.enum'
import Sidebar from '../Sidebar';
import { auth } from '../../../lib/auth'

import './index.css';
import { useMetamask } from '../../../hooks/useMetamask';
import { AuthJWT } from '../../../interfaces/auth';
import { User } from '../../../interfaces/user';
import { Role } from '../../../enums/roles.enum';
import AllAccounts from '../AllAccounts';
import AllTransactions from '../AllTransactions';
import AllCompanies from '../AllCompanies';
import AllComplaints from '../AllComplaints';
import { useCookies } from 'react-cookie';

const { Header, Content, Footer } = Layout;


export default function Admin() {
    const { hooks, metamask, connectMetamask, signMessage } = useMetamask();
    const { getWelcomeToken, login, verifyLogin, getUserInfo } = auth();
    const { useAccount, useIsActive, useIsActivating } = hooks;

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    
    const [page, setPage] = useState(Pages.ALL_ACCOUNTS);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [token, setToken] = useState<AuthJWT>();
    const [user, setUser] = useState<User>();
    const [cookies, setCookie] = useCookies();
    
    const userAccount: string = useAccount() as string || '0x0000000000000000000000000000000000000000';
    const isActive: boolean = useIsActive();
    const isActivating: boolean = useIsActivating();
    
    async function connect() {
        connectMetamask();
    }

    async function web2Auth() {
        const message:any = await getWelcomeToken(userAccount);
        const signature: string = await signMessage(message.data, userAccount);
        const jwt: AuthJWT = await login(message.data, userAccount, signature);
        const authorized: boolean = await verifyLogin(jwt);
        const user = await getUserInfo(jwt);
        setToken(jwt);
        setCookie('token', jwt.token, { path: '/admin' });
        setCookie('address', userAccount, { path: '/admin' });
        setCookie('userId', user.id, { path: '/admin' });
    
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
        setIsAuthorized(false);
        if (userAccount != '0x0000000000000000000000000000000000000000') {
          web2Auth();
        }
      }, [userAccount])

    useEffect(() => {
        verifyUserRole();
    }, [cookies])

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
            {isAuthorized && token !== undefined &&
                <>
                    <Header className='header' style={{ background: colorBgContainer }}>
                        <div
                            className='logo'
                        >LOGO</div>
                        <div className='title'>PROJECT NAME</div>
                    </Header>
                    <Layout className='workspace'>
                        <Sidebar token={token} user={user} onChangeMenu={changeMenu} />
                        <Layout>
                        <Content className='content'> 
                        { page === Pages.ALL_ACCOUNTS &&
                            <AllAccounts/>
                        }
                        { page === Pages.ALL_TRANSACTIONS && <AllTransactions/>}
                        { page === Pages.ALL_COMPANIES && <AllCompanies/>}
                        { page === Pages.ALL_COMPLAINTS && <AllComplaints/>}
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