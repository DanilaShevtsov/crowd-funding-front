import { useEffect, useState } from 'react';
import { Form, Input, Modal, Pagination } from 'antd';
import { useCookies } from "react-cookie";

import Company from '../Company';
import CompanyPage from '../CompanyPage';

import { companiesLib } from '../../lib/companies'; 
import { ComplaintStoreDto, complaintsLib } from '../../lib/complaints';
import { CompanyData } from '../../interfaces/companyData';

import './index.css';

const { storeComplaint } = complaintsLib();

interface ComplainValues {
    companyName: string;
    description: string;
}
interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: ComplainValues) => void;
    onCancel: () => void;
    projectName: string;
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
    open,
    onCreate,
    onCancel,
    projectName,
  }) => {
    const [form] = Form.useForm();
    console.log(projectName)
    return (
      <Modal
        open={open}
        title="Create complaint "
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: 'public' }}
        >
          <p>{ projectName }</p>
          <Form.Item name="description" label="Description">
            <Input type="textarea" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

function AllProjects(props: any) {
   
    const [listOfCompanies, setListOfCompanies] = useState<CompanyData[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 3;

    const [chosenCompany, setChosenCompany] = useState('');
    const [complainOfCompanyId, setComplainOfCompanyId] = useState('');
    const [complaintOpen, setComplaintOpen] = useState(false);
    const [complainOfCompanyName, setComplainOfCompanyName] = useState('');
    const [cookies, setCookie] = useCookies();

    const { getPaginatedCompanies, companyById } = companiesLib();

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

    async function showComplaintForm(companyId: string) {
      setComplaintOpen(true);
      setComplainOfCompanyId(companyId);
      const companyData = await companyById(cookies.token, companyId);
      setComplainOfCompanyName(companyData.name);
    }

    function onComplaintSend(values:any) {
      console.log(values);
      const companyId = complainOfCompanyId;
      const complaint = values.description;
      console.log(companyId, complaint);
      const complaintDto = new ComplaintStoreDto(companyId, complaint);
      storeComplaint(cookies.token, complaintDto);
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
                            listOfCompanies.map((companyData: CompanyData) => <Company data={companyData} key={companyData.id} onChoose={showCompanyPage} onComplaint={showComplaintForm} />)
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

            { complainOfCompanyId &&
              <CollectionCreateForm
              open={complaintOpen}
              onCreate={onComplaintSend}
              onCancel={() => {
                setComplainOfCompanyId('');
                setComplaintOpen(false);
              }}
              projectName={complainOfCompanyName}
              />
            }


        </>
    )
}

  
export default AllProjects;