import { Layout, Button, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useMetamask } from '../../hooks/useMetamask';
import { useEffect, useState } from 'react';
import { useAccountBalance } from '../../hooks/useAccountBalance';
import { connect } from 'react-redux';
import { AuthJWT } from '../../interfaces/auth';
import { auth } from '../../lib/auth'
import actions  from '../../redux/auth/actions';
import { Pages } from '../../enums/pages.enum';
import { useNavigate } from 'react-router-dom';
import { User } from '../../interfaces/user';
import { Role } from '../../enums/roles.enum';

const { Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }

function sliceAddress(address: string) {
  return address.slice(0, 15) + '...' + address.slice(-4);
}

const sideBarMenuItems: MenuItem[] = [
  getItem('Main page', Pages.MAIN),
  getItem('All projects', Pages.ALL_PROJECTS),
  getItem('Beneficiar cabinet', Pages.BENEFICIAR_CABINET, null, [
    getItem('Create Company', Pages.CREATE_COMPANY),
    getItem('My Companies', Pages.MY_COMPANIES)
  ]),
  { type: 'divider'} 
];

function Sidebar(props: any) {
  const navigate = useNavigate();
  const {
    authSuccess,
    onChangeMenu,
    address,
    token
  } = props
  const { hooks, metamask, connectMetamask, signMessage } = useMetamask();
  const { getWelcomeToken, login, verifyLogin, getUserInfo } = auth();
  const { useAccount, useIsActive, useIsActivating } = hooks;

  const userAccount: string = useAccount() as string || '0x0000000000000000000000000000000000000000';
  const userBalance: number = useAccountBalance(userAccount) || 0;
  const isActive: boolean = useIsActive();
  const isActivating: boolean = useIsActivating();

  const [user, setUser] = useState<User>();

  async function connect() {
    connectMetamask();
  }

  async function web2Auth() {
    console.log('auth')
    const message:string = await getWelcomeToken(userAccount);
    const signature: string = await signMessage(message, userAccount);
    const jwt: AuthJWT = await login(message, userAccount, signature);
    const authorized: boolean = await verifyLogin(jwt);
    const user = await getUserInfo(jwt);
    setUser(user);
    authSuccess({ token: jwt.token, address: userAccount, userId: user.id});
    
    if (!authorized) {
      console.log('something went wrong');
    }
  }

  useEffect(()=> {
    if (
        userAccount != '0x0000000000000000000000000000000000000000' && (
        userAccount != address ||
        token == null
      )
    ) {
      web2Auth();
    }
  }, [userAccount])

  useEffect(() => {
    if (!isActive && !isActivating) {
      metamask.connectEagerly();
    }
  }, [isActive, isActivating]);

  return (
      <Sider
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
        className='sider'
        width='none'  
      >
        {userAccount === '0x0000000000000000000000000000000000000000' &&
          <Button
            type='primary'
            block={true}
            onClick={connect}
          >
            Connect Metamask
          </Button>
        }

        {userAccount != '0x0000000000000000000000000000000000000000' && 
          <div>
            <p>{sliceAddress(userAccount)}</p>
            <p>Balance: {userBalance} ETH</p>
          </div>
        }
        <Menu
          theme='dark'
          items={sideBarMenuItems}
          defaultSelectedKeys={[Pages.MAIN]}
          onClick={({ key }) => {
            onChangeMenu(key);
          }}
        />
        {user !== undefined && (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) &&
          <div style={{ display: 'flex', justifyContent: 'center' }} onClick={() => navigate('/admin')} >
            <Button danger type='dashed' >Admin Panel</Button>
          </div>
        }
      </Sider>
  );
}

function mapStateToProps(state: any) {
  return { onChangepage: (setPage: string) => state, ...auth }
}

export default connect(mapStateToProps, actions)(Sidebar)