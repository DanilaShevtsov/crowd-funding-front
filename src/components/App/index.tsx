import React, { useEffect, useState } from 'react';
import { Layout, theme } from 'antd';

import Sidebar from '../Sidebar';
import TopProjects from '../TopProjects';
import AllProjects from '../AllProjects';

import { connect } from 'react-redux';
import authActions from '../../redux/auth/actions';
import companiesActions from '../../redux/companies/actions';
import { Pages } from '../../enums/pages.enum'

import './index.css';
import CreateCompanyForm from '../CreateCompanyForm';
import MyCompanies from '../MyCompanies';

const { Header, Content, Footer } = Layout;

const App: React.FC = (props: any) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [page, setPage] = useState('');

  function changeMenu(page: Pages) {
    setPage(page);
  }

  const {
    loadAuthStorage
  } = props

  useEffect(() => {
    loadAuthStorage();
    setPage(Pages.MAIN)
  }, [])

  return (
    <div className='app'>
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
          { page === Pages.MAIN &&
            <TopProjects/>
          }
          { page === Pages.ALL_PROJECTS && <AllProjects/>}
          { page === Pages.CREATE_COMPANY && <CreateCompanyForm/>}
          { page === Pages.MY_COMPANIES && <MyCompanies/>}
          </Content>
          <Footer className='footer'> Footer exists. Just trust me!</Footer>
        </Layout>
      </Layout>
    </div>
  );
};

const mapStateToProps = ({
  auth,
  companies
}: any) => ({
  auth,
  companies
});

export default connect(mapStateToProps, {
  ...authActions, 
  ...companiesActions
})(App);