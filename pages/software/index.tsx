import type { NextPage } from 'next'
import Link from 'next/link'
import {useState,useEffect} from "react"
import { Button ,Space, Table, Tag} from 'antd';
import api from "../../src/restApi/index";
import type { ColumnsType } from 'antd/es/table'
import { useSelector } from 'react-redux';
import moment from "moment";
import {InfoOutlined,EditOutlined } from '@ant-design/icons';
const apiobj = new api();
interface DataType {
  key: string;
  id : number;
  softwareName: string;
  releaseDttm: number;
  version: string;
  description: string;
  phoneNumber: string;
  softwareCode: string;
}

const Softwares: NextPage = () => {
  const [software,setSoftwares] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const userData = useSelector((state:any) => state.login.userinfo);
  useEffect(()=>{
     getSoftwaresList();
  },[])
  const getSoftwaresList= async()=>{
    console.log("useEffect called",userData.id)
    if(userData.id){
        setIsLoading(true);
        console.log(userData.id)
        try {
          const response: any = await apiobj.request("software/softwarebyuid", {"userId": userData.id}, "post");
          setSoftwares(response.data)
          setIsLoading(false);
        }catch(error: any){
          setIsLoading(false);
        }
      
    }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
            <Link href={`/software/detail/${record.softwareCode}`} > 
           <Button shape="circle" icon={<InfoOutlined />} /> 
           </Link>
          <Link href={`/software/${record.id}`} > 
           <Button shape="circle" icon={<EditOutlined />} />
            </Link>
        </Space>
      ),
    },
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Software Name',
      dataIndex: 'softwareName',
      key: 'softwareName',
    },
    {
      title: 'Release Date',
      dataIndex: 'releaseDttm',
     render: (text: any) => moment(new Date(parseInt(text))).format("MM/DD/YYYY hh:mm A")
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: 'Software code',
      dataIndex: 'softwareCode',
      key: 'softwareCode',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
        title: 'Company name',
        dataIndex: 'companyName',
        key: 'companyName',
      },
    {
      title: 'Software type',
      dataIndex: 'softwareTypeName',
      key: 'softwareTypeName',
    },
   
   
  ];
  return (
      <div className='space-Top'>
        <h2>Software List

        <Link href="/software/create" >
           <Button type="primary" style={{float:"right"}}>Add</Button>
            </Link>
        </h2>
           <br/><br/>
           <div className="responsivTable">
            <Table 
            loading={isLoading}
            columns={columns} dataSource={software.map((el: any, idx: any) => ({
                                key: idx,
                                ...el
                              }))} />
           </div>                   
      </div>
  )
}

export default Softwares
