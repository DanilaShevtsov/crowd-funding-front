import { useEffect, useState } from 'react';
import Company from '../Company';

import { companiesLib } from '../../lib/companies'; 
import { CompanyData } from '../../interfaces/companyData';
import { useCookies } from 'react-cookie';


import './index.css';
import { Companies } from '../../interfaces/companies';

function TopProjects() {
    
    const [listOfCompanies, setListOfCompanies] = useState<CompanyData[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [ cookies, setCookies ] = useCookies();

    const { getPaginatedCompanies } = companiesLib();

    async function loadCompanies() {
        const rawCompanies: Companies = await getPaginatedCompanies(cookies.token, 0);
        setListOfCompanies(rawCompanies.data);
    }

    function showCompanyPage(companyId: string) {
        console.log('awwee', companyId);
    }

    useEffect(() => {
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

  
  export default TopProjects;