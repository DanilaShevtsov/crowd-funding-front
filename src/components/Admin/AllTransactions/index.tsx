import { Tag, Space } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { AuthJWT } from "../../../interfaces/auth";
import { roundNumber } from "../../../lib/numberLib";
import { transactions } from "../../../lib/transactions";
import { TransactionStatus } from "./status.enum";

interface AllTransactionsProps {
    token?: AuthJWT
}

export default function AllTransactions(props: AllTransactionsProps) {
  function sliceAddress(address: string) {
    return address.slice(0, 15) + '...' + address.slice(-4);
  }

  const {
    token,
  } = props
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
          title: 'TxId',
          dataIndex: 'txId',
          key: 'txId',
        },
        {
          title: 'Company',
          dataIndex: 'companyName',
          key: 'companyName',
        },
        {
          title: 'Status',
          key: 'status',
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
        const transactions = (await getTransactions(token?.token as string)).data;
        transactions.map((transaction: any) => {
          transaction.from = sliceAddress(transaction.from);
          transaction.to = sliceAddress(transaction.to);
          transaction.txId = sliceAddress(transaction.txId);
          transaction.value = roundNumber(transaction.value, 18, 6)
          transaction.fee = roundNumber(transaction.fee, 18, 6)
          transaction.companyName = transaction.company.name;
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
      <>
        { loaded && data !== undefined && <Table columns={columns} dataSource={data}/> }
      </>
    )
}