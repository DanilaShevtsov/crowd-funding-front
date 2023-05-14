import { useEffect, useState } from 'react';
import Company from '../Company';

import { connect } from 'react-redux';
import authActions from '../../redux/auth/actions';
import { companiesLib } from '../../lib/companies'; 
import { CompanyData } from '../../interfaces/companyData';

import './index.css';
import { Companies } from '../../interfaces/companies';

function TopProjects(props: any) {
    const {
        auth,
        loadAuthStorage,
    } = props
    
    const [listOfCompanies, setListOfCompanies] = useState<CompanyData[]>([]);
    const [loaded, setLoaded] = useState(false);

    const { getPaginatedCompanies } = companiesLib();

    async function loadCompanies() {
        const rawCompanies: Companies = await getPaginatedCompanies(auth.token, 0);
        setListOfCompanies(rawCompanies.data);
    }

    function showCompanyPage(companyId: string) {
        console.log('awwee', companyId);
    }

    useEffect(() => {
        loadAuthStorage();
        loadCompanies();
    }, [])

    useEffect(() => {
        if (listOfCompanies.length > 0) {
            setLoaded(true);
        }
    }, [listOfCompanies])

    return (
        <div className='top-projects'>
            <div className='sub-title'>TOP 3 PROJECTS</div>
            <div className='companies'>
                { loaded && listOfCompanies.length > 0 &&
                    listOfCompanies.map((companyData: CompanyData) => <Company data={companyData} key={companyData.id} onChoose={showCompanyPage} />)
                }
            </div>
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
  })(TopProjects);