import { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import authActions from '../../redux/auth/actions';
import { companiesLib } from '../../lib/companies'; 
import { CompanyData } from '../../interfaces/companyData';

import './index.css';
import { Button, DatePicker, Form, Input, InputNumber, message, notification, Radio, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;

function CreateCompanyForm(props: any) {
  enum NotificationType {
    SUCCESS = 'success',
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error'
  }

  const {
        auth,
        loadAuthStorage,
    } = props
    
    const [createDescription, setCreateDescription] = useState("");
    const [createStatus, setCreateStatus] = useState<NotificationType>(NotificationType.INFO);

    const normFile = (e: any) => {
      if (Array.isArray(e)) {
        return e;
      }
      return e?.fileList;
    };

    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = () => {
      api[createStatus]({
        message: 'Create new company',
        description: createDescription
      });
    };

    useEffect(() => {
      if (createStatus === NotificationType.ERROR || createStatus === NotificationType.SUCCESS) {
        openNotificationWithIcon()
        setCreateDescription("")
        setCreateStatus(NotificationType.INFO)
      }
    }, [createStatus])

    const onFinish = async (values: any) => {
      values.goal = Number(values.goal);
      values.timeout = values.timeout[1].toJSON();
      const { createNewCompany } = companiesLib();
      try {
        const result = await createNewCompany(auth.token, values);
        if (result.status === 200) {
          console.log(1)
          setCreateDescription('Company created')
          setCreateStatus(NotificationType.SUCCESS)
        }
      } catch (error: any) {
        console.log(error)
        setCreateDescription(error.message)
        setCreateStatus(NotificationType.ERROR)
      }
    };
  

    const rangeConfig = {
      rules: [{ type: 'array' as const, required: true, message: 'Please select time!', }],
    };

    return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600, minWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <div>{contextHolder}</div>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Enter new company name' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item 
        label="Description" 
        name="description"
        rules={[{ required: true, message: 'Write some description' }]}
      >
        <TextArea rows={6} />
      </Form.Item>

      <Form.Item label="Goal" name="goal" initialValue={1.0}>
          <InputNumber min={0.0000000000000001} max={10} step="0.00000000000001" stringMode style={{ width: 250 }} addonAfter={"ETH"}/>
      </Form.Item>

      <Form.Item name="timeout" label="Timeout" {...rangeConfig}>
        <RangePicker 
        showTime 
        format="YYYY-MM-DD HH:mm:ss" 
        defaultValue={
          [
            dayjs(), 
            dayjs().add(5, 'day')
         ]
        }
        disabled={[true, false]}/>
      </Form.Item>

      <Form.Item label="Avatar" valuePropName="fileList" getValueFromEvent={normFile}>
        <Upload action="/upload.do" listType="picture-card">
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    )
}

const mapStateToProps = ({
    auth,
  }: any) => ({
    auth,
  });
  
  export default connect(mapStateToProps, {
    ...authActions, 
  })(CreateCompanyForm);