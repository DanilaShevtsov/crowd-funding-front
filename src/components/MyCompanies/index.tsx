import { useEffect, useState } from 'react';
import Company from '../Company';


import { companiesLib } from '../../lib/companies'; 
import { CompanyData } from '../../interfaces/companyData';

import './index.css';
import { Companies } from '../../interfaces/companies';
import { Layout, Breadcrumb, Button, Space, Pagination } from 'antd';
import { Content } from 'antd/es/layout/layout';
import TopProjects from '../TopProjects';
import { CompanyStatus } from './company-status.enum';
import CompanyPage from '../CompanyPage';
import { useCookies } from "react-cookie";


function MyCompanies() {    
    const [listOfCompanies, setListOfCompanies] = useState<CompanyData[]>([]);
    const [companyStatus, setCompanyStatus] = useState(CompanyStatus.RUNNING);
    const [loaded, setLoaded] = useState(false);
    const [chosenCompany, setChosenCompany] = useState('');
    const [cookies, setCookies] = useCookies();

    const { getCompaniesByStatusMy } = companiesLib();
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 3;

    async function loadCompanies(companyStatus: CompanyStatus) {
        const rawCompanies = await getCompaniesByStatusMy(cookies.token, 0, pageSize, companyStatus, cookies.userId);
        const {data: allProjects}= rawCompanies
        setListOfCompanies(allProjects);
        setTotalItems(rawCompanies.meta.totalItems);
    }

    async function changePage(page: number, pageSize: number) {
        const rawCompanies = await getCompaniesByStatusMy(cookies.token, page, undefined, companyStatus, cookies.userId);
        const {data: allProjects}= rawCompanies
        setListOfCompanies(allProjects);
    }

    function showCompanyPage(companyId: string) {
        setChosenCompany(companyId);
        console.log('awwee', companyId);
    }

    function changeStatus(status: any) {
        setCompanyStatus(status)
    }

    useEffect(() => {
        console.log(cookies.userId);
        console.log(cookies.token);
        console.log(cookies.address);
        loadCompanies(companyStatus);
    }, [companyStatus])

    useEffect(() => {
        if (listOfCompanies.length > 0) {
            setLoaded(true);
        }
    }, [listOfCompanies])

    return (
        <>
            { chosenCompany === '' &&
                <Layout style={{ padding: '0 24px 24px' }}>
                <Space wrap>
                    <Button id={CompanyStatus.RUNNING} type="primary" ghost onClick={(e) => changeStatus(e.currentTarget.id)}>
                        Running
                    </Button>
                    <Button id={CompanyStatus.SUCCESS} type="primary"ghost onClick={(e) => changeStatus(e.currentTarget.id)}>Success</Button>
                    <Button id={CompanyStatus.FAIL} type="primary" danger ghost onClick={(e) => changeStatus(e.currentTarget.id)}>
                        Failed
                    </Button>
                    <Button id={CompanyStatus.CANCELED} type="primary" danger ghost onClick={(e) => changeStatus(e.currentTarget.id)}>
                        Canceled
                    </Button>
                </Space>
                <Content
                  style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                  }}
                >
                   { loaded && listOfCompanies.length > 0 &&
                        listOfCompanies.map((companyData: CompanyData) => <Company data={companyData} key={companyData.id} onChoose={showCompanyPage} />)
                    }
                    <Pagination
                        style={{justifySelf: "flex-end"}}
                        defaultPageSize={pageSize}
                        defaultCurrent={1}
                        total={totalItems}
                        onChange={changePage}
                    />
                </Content>
              </Layout>
            }

            { chosenCompany !== '' &&
                <CompanyPage companyId={chosenCompany} token={cookies.token} />
            }
        </>
    )
}
  
export default MyCompanies;