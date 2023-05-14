import { Progress, Image, InputNumber, Button } from 'antd';
import { companiesLib } from '../../lib/companies'
import { useEffect, useState } from 'react';
import { CompanyData } from '../../interfaces/companyData';
import { TeamOutlined } from '@ant-design/icons';
import { roundNumber } from '../../lib/numberLib';
import { useMetamask } from '../../hooks/useMetamask';
import { transactions } from '../../lib/transactions'

import './index.css';

interface CompanyPageProps {
    companyId: string
    token: string
}
const { companyById } = companiesLib();
const { sendTransaction } = transactions();
const DEFAULT_DONATE_VALUE: number = 0.05;

function sliceAddress(address: string) {
    return address.slice(0, 15) + '...' + address.slice(-4);
}

function companyStatus(status: string) {
    switch(status) {
        case('running') : return 'active';
        case('sucess') : return 'success';
        case('failed') : return 'exception';
        case('closed') : return 'exception';
        default : return 'normal';
    }
}

export default function CompanyPage({ companyId, token }: CompanyPageProps) {
    const [company, setCompany] = useState<CompanyData>();
    const [loaded, setLoaded] = useState(false);
    const [donateValue, setDonateValue] = useState(DEFAULT_DONATE_VALUE);

    const { hooks, sendValue } = useMetamask();
    const { useAccount } = hooks;

    const userAccount: string = useAccount() as string || '0x0000000000000000000000000000000000000000';

    async function loadCompany() {
        setCompany(await companyById(token, companyId));
    }

    async function donate(value: number) {
        const from = userAccount;
        const to = process.env.REACT_APP_SERVICE_WALLET as string;
        console.log(to);
        const wei = value * Math.pow(10, 18);
        const tx: string = await sendValue(from, to, wei);

        sendTransaction(token, companyId, tx)
    }

    useEffect(() => {
        loadCompany();
    }, [])

    useEffect(() => {
        if (company != undefined && company.id === companyId) {
            setLoaded(true);
        }
    }, [company])

    return (
        <>
            {loaded && company !== undefined &&
                <div className="company-page">
                
                    <div className='company-page-main-info'>
                        <div className='company-page-image'>
                            <Image
                                height={'100%'}
                                width={'100%'}
                                src={company.image}
                                
                                fallback="data:image/png;base64,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"
                            />
                        </div>
                        <div className='company-page-about'>
                            <h1>{company.name}</h1>
                            <span><b>Status:</b> {company.status}</span>
                            <span><b>Owner:</b> {sliceAddress(company.owner.pubKey)}</span>
                            <span><b>Timeout:</b> {new Date(company.timeout).toLocaleString()}</span>
                            <span><b>Current Balance:</b> {roundNumber(company.balance, 0, 4)} ETH</span>
                            <span><b>Goal:</b> {roundNumber(company.goal, 0, 4)} ETH</span>
                        </div>
                        <div className='company-page-progress'>
                            <Progress type='circle' 
                                percent={roundNumber(company.balance / company.goal * 100, 0, 4)}
                                status={companyStatus(company.status)}    
                            />
                            <div className='followers'>
                                <TeamOutlined />
                                <span>{company.followerCount}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        { company.description != null && 
                            <span>{company.description}</span>
                        }

                        { company.description == null && 
                            <span><i>Without description</i></span>
                        }
                    </div>
                    <div className='company-page-donate'>
                        <span style={{ marginRight: '10px', width: '100%' }}><b>You can donate this project</b></span>
                        <InputNumber
                            addonAfter="ETH"
                            style={{ width: '70%', marginRight: '10px', marginTop: '10px' }}
                            defaultValue={DEFAULT_DONATE_VALUE}
                            min={1/10**18}
                            onChange={(value) => {
                                setDonateValue(Number(value));
                            }}
                        />
                        <Button
                            type="primary"
                            htmlType="submit"
                            onClick={() => {
                                donate(donateValue);
                            }}
                            style={{ marginTop: '10px' }}
                        >Donate</Button>
                    </div>
                </div>
            }
        </>
    )
}