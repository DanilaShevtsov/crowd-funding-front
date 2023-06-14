import { useEffect, useState } from 'react';
import { Pagination } from 'antd';
import { useCookies } from "react-cookie";

import Company from '../Company';
import CompanyPage from '../CompanyPage';

import { companiesLib } from '../../lib/companies'; 
import { CompanyData } from '../../interfaces/companyData';

import './index.css';

function AllProjects(props: any) {
   
    const [listOfCompanies, setListOfCompanies] = useState<CompanyData[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 3;

    const [chosenCompany, setChosenCompany] = useState('');
    const [cookies, setCookie] = useCookies();

    const { getPaginatedCompanies } = companiesLib();

    async function loadCompanies() {
        const rawCompanies = await getPaginatedCompanies(cookies.token, 0, pageSize);
        const {data: allProjects}= rawCompanies
        setListOfCompanies(allProjects);
        setTotalItems(rawCompanies.meta.totalItems);
    }

    async function changePage(page: number, pageSize: number) {
        const rawCompanies = await getPaginatedCompanies(cookies.token, page, pageSize);
        const {data: allProjects}= rawCompanies
        setListOfCompanies(allProjects);
    }

    function showCompanyPage(companyId: string) {
        setChosenCompany(companyId);
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
        <>
            { chosenCompany === '' &&
                <div className='all-projects'>
                    <div className='sub-title'>All Projects</div>
                    <div className='companies'>
                        { loaded && listOfCompanies.length > 0 &&
                            listOfCompanies.map((companyData: CompanyData) => <Company data={companyData} key={companyData.id} onChoose={showCompanyPage} />)
                        }
                    </div>
                    <Pagination
                        defaultPageSize={pageSize}
                        defaultCurrent={1}
                        total={totalItems}
                        onChange={changePage}
                    />
                </div>
            }

            { chosenCompany !== '' &&
                <CompanyPage companyId={chosenCompany} token={cookies.token} />
            }
        </>
    )
}

  
export default AllProjects;