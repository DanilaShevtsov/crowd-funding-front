import { useEffect, useState } from 'react';
import { Pagination } from 'antd';
import Company from '../Company';
import { connect } from 'react-redux';
import authActions from '../../redux/auth/actions';
import { companiesLib } from '../../lib/companies'; 
import { CompanyData } from '../../interfaces/companyData';

import './index.css';

function AllProjects(props: any) {
    const {
        auth,
        loadAuthStorage,
    } = props
    
    const [listOfCompanies, setListOfCompanies] = useState<CompanyData[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 3;

    const { getPaginatedCompanies } = companiesLib();

    async function loadCompanies() {
        const rawCompanies = await getPaginatedCompanies(auth.token, 0, pageSize);
        const {data: allProjects}= rawCompanies
        setListOfCompanies(allProjects);
        setTotalItems(rawCompanies.meta.totalItems);
    }

    async function changePage(page: number, pageSize: number) {
        const rawCompanies = await getPaginatedCompanies(auth.token, page, pageSize);
        const {data: allProjects}= rawCompanies
        setListOfCompanies(allProjects);
        console.log(page, pageSize);
    }

    useEffect(() => {
        loadAuthStorage();
        loadCompanies();
    }, [])

    useEffect(() => {
        if (listOfCompanies.length > 0) {
            setLoaded(true);
            console.log(loaded)
        }
    }, [listOfCompanies])

    return (
        <div className='all-projects'>
            <div className='sub-title'>All Projects</div>
            <div className='companies'>
                { loaded && listOfCompanies.length > 0 &&
                    listOfCompanies.map((companyData: CompanyData) => <Company data={companyData} key={companyData.id} />)
                }
            </div>
            <Pagination
                defaultPageSize={pageSize}
                defaultCurrent={1}
                total={totalItems}
                onChange={changePage}
            />
        </div>
    )
}

const mapStateToProps = ({
    auth,
  }: any) => ({
    auth,
  });
  
  export default connect(mapStateToProps, {
    ...authActions, 
  })(AllProjects);