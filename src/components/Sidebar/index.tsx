import { Layout, Button, Menu, Modal } from 'antd';
import type { MenuProps } from 'antd';
import { useMetamask } from '../../hooks/useMetamask';
import { useEffect, useState } from 'react';
import { useAccountBalance } from '../../hooks/useAccountBalance';

import { AuthJWT } from '../../interfaces/auth';
import { auth } from '../../lib/auth'
import { Pages } from '../../enums/pages.enum';
import { useNavigate } from 'react-router-dom';
import { User } from '../../interfaces/user';
import { Role } from '../../enums/roles.enum';
import { useCookies } from "react-cookie";

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
  address = address || '0x0000000000000000000000000000000000000000';
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
    onChangeMenu,
  } = props
  const { hooks, metamask, connectMetamask, signMessage } = useMetamask();
  const { getWelcomeToken, login, verifyLogin, getUserInfo } = auth();
  const { useAccount, useIsActive, useIsActivating } = hooks;

  const userAccount: string = useAccount() as string || '0x0000000000000000000000000000000000000000';
  const userBalance: number = useAccountBalance(userAccount) || 0;
  // const isActive: boolean = useIsActive();
  // const isActivating: boolean = useIsActivating();

  const [user, setUser] = useState<User>();
  const [cookies, setCookie] = useCookies();

  async function connect() {
    connectMetamask();
  }

  async function web2Auth() {
    let message: any;
    message = await getWelcomeToken(userAccount);
    if (message.status === 403) {
      showModal()
    } else {
      const signature: string = await signMessage(message.data, userAccount);
      const jwt: AuthJWT = await login(message.data, userAccount, signature);
      const authorized: boolean = await verifyLogin(jwt);
      const user = await getUserInfo(jwt);
      setUser(user);
      setCookie('token', jwt.token, { path: '/' });
      setCookie('address', userAccount, { path: '/' });
      setCookie('userId', user.id, { path: '/' });
      
      if (!authorized) {
        console.log('something went wrong');
      }
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(()=> {
    if (
        userAccount != '0x0000000000000000000000000000000000000000' && (
        userAccount != cookies.address ||
        cookies.token == undefined
      )
    ) {
      web2Auth();
    }
  }, [userAccount])

  // useEffect(() => {
  //   if (!isActive && !isActivating) {
  //     metamask.connectEagerly();
  //   }
  // }, [isActive, isActivating]);

  return (
      <Sider
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
        className='sider'
        width='none'  
      >
         <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>You have been banned</p>
          </Modal>
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
            <p>{sliceAddress(cookies.address)}</p>
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

export default Sidebar