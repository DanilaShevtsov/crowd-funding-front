import { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import authActions from '../../redux/auth/actions';
import { companiesLib } from '../../lib/companies'; 
import { CompanyData } from '../../interfaces/companyData';

import './index.css';
import { Button, DatePicker, Form, Input, InputNumber, message, notification, Upload, UploadProps } from 'antd';
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
    
    const [imageFile, setImageFile] = useState();
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
      console.log(values)
      values.goal = Number(values.goal);
      values.timeout = values.timeout[1].toJSON();
      values.image = values.image[0].url;
      console.log(values)
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

    const uploadProps: UploadProps = {
      name: 'image',
      action: 'https://api.imgbb.com/1/upload?key=a9daf675b1fe261f9461ad6d4d4a806f',
      listType: "picture-card",
      onChange(info: any) {
        console.log(info)
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          info.file.url = info.file.response.data.display_url;
          setImageFile(info.file.response.data.display_url)
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
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

      <Form.Item label="Avatar" valuePropName="fileList" getValueFromEvent={normFile} name="image">
        <Upload {...uploadProps} >
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