import { Tag, Space, InputNumber, Button } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { AuthJWT } from "../../../interfaces/auth";
import { roundNumber } from "../../../lib/numberLib";
import { transactions } from "../../../lib/transactions";
import { TransactionStatus } from "./status.enum";

import './index.css'
import { useCookies } from "react-cookie";



export default function AllTransactions() {
  const [cookies, setCookie] = useCookies();

  function sliceAddress(address: string) {
    return address.slice(0, 15) + '...' + address.slice(-4);
  }

  interface DataType {
      from: string;
      to: string;
      value: number;
      fee: number;
      txId: string;
      companyName: string;
      status: string;
    }
    function colorStatus(status: any) {
        let color: any;
        switch (status) {
            case TransactionStatus.PENDING_FROM_APP:
            case TransactionStatus.PENDING_IN_APP:
                color = "yellow";
                break;
            case TransactionStatus.FAIL_FROM_APP:
            case TransactionStatus.FAIL_IN_APP:
                color = "red";
                break;
            case TransactionStatus.SUCCESS_FROM_APP:
            case TransactionStatus.SUCCESS_IN_APP:
                color = "green";
                break;
        }
        return  (
            <Tag color={color} key={status}>
              {status.toUpperCase()}
            </Tag>
          )
    }
      
    const columns: ColumnsType<DataType> = [
        {
          title: 'TxId',
          dataIndex: 'txId',
          fixed: 'left',
          key: 'txId',
        },
        {
          title: 'From',
          dataIndex: 'from',
          key: 'from',
        },
        {
          title: 'To',
          dataIndex: 'to',
          key: 'to',
        },
        {
          title: 'Value',
          dataIndex: 'value',
          key: 'value',
        },
        {
          title: 'Fee',
          dataIndex: 'fee',
          key: 'fee',
        },
        {
          title: 'Company',
          dataIndex: 'companyName',
          key: 'companyName',
        },
        {
          title: 'Status',
          key: 'status',
          fixed: 'right',
          dataIndex: 'status',
          render: (_, { status }) => (
            <>
              {
               colorStatus(status)
              }
            </>
          ),
        },
      ];

      const [data, setData] = useState([]);
      const [loaded, setLoaded] = useState(false);

      async function getData() {
        const transactions = (await getTransactions(cookies.token as string)).data;
        transactions.map((transaction: any) => {
          transaction.from = sliceAddress(transaction.from);
          transaction.to = sliceAddress(transaction.to);
          transaction.txId = sliceAddress(transaction.txId);
          transaction.value = roundNumber(transaction.value, 0, 10) + " ETH"
          transaction.fee = roundNumber(transaction.fee, 0, 10) + " ETH"
          transaction.companyName = transaction.company.name;
          console.log(transaction)
          return transaction;
        })
        setData(transactions);
      }

      useEffect(() => {
        if (data?.length > 0) {
          setLoaded(true);
        }
    }, [data])

      useEffect(() => {
        getData()
      }, [])

    const { getTransactions } = transactions();

    return (
      <div className='all-transactions'>
        { loaded && data !== undefined && <Table pagination={false} columns={columns} dataSource={data} scroll={{ x: 1500, y: 1000 }}/> }
        <div className='company-page-donate'>
          <span style={{ marginRight: '10px', width: '100%' }}><b>Enter transaction id to do actions</b></span>
          <InputNumber
              addonAfter="Tx ID"
              style={{ width: '70%', marginRight: '10px', marginTop: '10px' }}
              min={1/10**18}
          />
          <Button
              // type="primary"
              // htmlType="submit"
              className="positive-button"
              style={{ marginTop: '10px', marginRight: '10px' }}
          >Check AML</Button>
          <Button
              type="primary"
              htmlType="submit"
              danger
              style={{ marginTop: '10px' }}
          >Block</Button>
        </div>
      </div>
    )
}