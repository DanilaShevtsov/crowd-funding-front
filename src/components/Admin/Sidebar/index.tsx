import { Layout, Button, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useMetamask } from '../../../hooks/useMetamask';
import { connect } from 'react-redux';
import { AuthJWT } from '../../../interfaces/auth';
import { Pages } from '../enums/pages.enum';
import { Role } from '../../../enums/roles.enum';
import { User } from '../../../interfaces/user';

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
  getItem('All Accounts', Pages.ALL_ACCOUNTS),
  getItem('All Transactions', Pages.ALL_TRANSACTIONS),
  getItem('All Companies', Pages.ALL_COMPANIES),
];

interface SiderProps {
    token?: AuthJWT;
    user?: User;
    onChangeMenu: (key: Pages) => void;
}

export default function Sidebar(props: SiderProps) {
  const {
    token,
    user,
    onChangeMenu,
  } = props

  const { hooks } = useMetamask();
  const { useAccount } = hooks;

  const userAccount: string = useAccount() as string || '0x0000000000000000000000000000000000000000';

  function processRole(role: string): string {
    switch (role) {
      case Role.ADMIN: return 'Admin'
      case Role.USER: return 'User'
      case Role.SUPER_ADMIN: return 'Super Admin'
      default: return 'UNKNOWN_ROLE'
    }
  }

  return (
      <Sider
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

        {userAccount != '0x0000000000000000000000000000000000000000' && user !== undefined &&
          <div>
            <p>{sliceAddress(userAccount)}</p>
            <p>Role: {processRole(user.role)}</p>
          </div>
        }
        <Menu
          theme='dark'
          items={sideBarMenuItems}
          defaultSelectedKeys={[Pages.ALL_ACCOUNTS]}
          onClick={({ key }) => {
            onChangeMenu(key as Pages);
          }}
        />
      </Sider>
  );
}