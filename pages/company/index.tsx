import type { NextPage } from 'next'
import Link from 'next/link'
import {useState,useEffect} from "react"
import {Col, Row, Button ,Space, Table, Input } from 'antd';
import api from "../../src/restApi/index";
import type { ColumnsType } from 'antd/es/table'
import { useSelector } from 'react-redux';
import useDidMountEffectWithSearchDelay  from "../../src/customHooks/useDidMountEffectWithSearch"


const apiobj = new api();
interface DataType {
  key: string;
  id : number;
  companyName: string;
  contactPerson: string;
  email: string;
  websiteUrl: string;
  phoneNumber: string;
}

const Company: NextPage = () => {
  const [company,setCompany] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [filterCompanyName,setFilterCompanyName] = useState("");
  const [filterContactPerson,setFilterContactPerson] = useState("");
  const [filterEmail,setFilterEmail] = useState("");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showQuickJumper:true,
      total: 0,
      responsive:true,
      showLessItems:true,
      showTotal:(total:any, range:any) => `${range[0]}-${range[1]} of ${total} items`
    },
  });
  const userData = useSelector((state:any) => state.login.userinfo);
  
  useEffect(()=>{
    const getData = async() => {
      setIsLoading(true); 
      try {
          await getCountCompanyList();
          await getCompanyList(0);
          setIsLoading(false);
      }
      catch(error: any){
        setIsLoading(false);
      }
    }
    getData();
  },[])
  const getDataOnSearch = async() => {
    // if(filterCompanyName || filterContactPerson || filterEmail){
        setIsLoading(true); 
        try {
            await getCountCompanyList();
            await getCompanyList(0);
            setIsLoading(false);
        }
        catch(error: any){
          setIsLoading(false);
        }
    // } 
  }
  useDidMountEffectWithSearchDelay(() => {
    getDataOnSearch();
    
  },[filterCompanyName,filterContactPerson,filterEmail])
  
  const getCountCompanyList = async() => {
        if(userData.id){
          try {
            const response: any = await apiobj.request("company/companiesbyuid",
                        { "userId": userData.id,"count":true,
                          "email" : filterEmail,
                          "contactPerson": filterContactPerson,
                          "companyName":filterCompanyName
                         }, 
                        "post");
            setTableParams({
              ...tableParams,
              pagination: {
                ...tableParams.pagination,
                total:  response.data[0].count || 0
              },
            });
           }catch(error: any){
          }
        
      }
  }
  const getCompanyList= async(offsetValue: number)=>{
     if(userData.id){
        try {
          const response: any = await apiobj.request("company/companiesbyuid", 
          {"userId": userData.id,"offset":offsetValue,
           "email" : filterEmail,
           "contactPerson": filterContactPerson,
           "companyName":filterCompanyName,
           "limit":tableParams.pagination.pageSize,
          }, "post");
          setCompany(response.data)
        }catch(error: any){
        }
      
     }
  }
   // Pagination on change.
   const handleTableChange= async (pagination:any, filters:any, sorter:any) => {
    const count=pagination.pageSize;
    const pager = tableParams;
    pager.pagination.current = pagination.current;
    pager.pagination.pageSize = pagination.pageSize;
    var offset :number= ( pager.pagination.current - 1) * count;	
    setTableParams(pager);
    setIsLoading(true); 
    try {
      getCompanyList(offset);
      setIsLoading(false);
    }catch(error: any){
      setIsLoading(false);
    }  
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Contact Person',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Website URL',
      dataIndex: 'websiteUrl',
      key: 'websiteUrl',
    },
    {
      title: 'Phone number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link href={`/company/${record.id}`} > Edit  </Link>
          {/* <a>Delete</a> */}
        </Space>
      ),
    },
  ];
  return (
      <div className='space-Top'>
        <h2>Company List

        <Link href="/company/create" >
           <Button type="primary" style={{float:"right"}}>Add</Button>
            </Link>
        </h2>
           <br/>
           <Row>
          <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 5 }} 
           lg={{ span: 5 }}  xl={{ span: 5}} xxl={{ span: 5 }}></Col>
             <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 6 }} 
           lg={{ span: 6 }}  xl={{ span: 6 }} xxl={{ span: 6 }}>
                <div    style={{padding:"5px 5px 5px 0px"}}>
                  <label>Company:</label>
                  <Input placeholder="Company " value={filterCompanyName} 
                   onChange={(e) => {setFilterCompanyName(e.target.value)}}
                  style={{width:"100%"}} />
                </div>
            </Col>
             <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 6 }} 
           lg={{ span: 6 }}  xl={{ span: 6 }} xxl={{ span: 6 }}>
                <div    style={{padding:"5px 5px 5px 0px"}}>
                <label>Contact person:</label>
                  <Input placeholder="Contact person " value={filterContactPerson} 
                  onChange={(e) => { setFilterContactPerson(e.target.value)}}
                  style={{width:"100%"}} />
                </div>
            </Col>
             <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 6 }} 
           lg={{ span: 6 }}  xl={{ span: 6 }} xxl={{ span: 6 }}>
                <div    style={{padding:"5px 5px 5px 0px"}}>
                <label>Email:</label>
                  <Input placeholder="Email " value={filterEmail} 
                  onChange={(e) => {setFilterEmail(e.target.value)}}
                  style={{width:"100%"}} />
                </div>
          </Col>
          {/* <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 1 }} 
           lg={{ span: 1 }}  xl={{ span: 1 }} xxl={{ span: 1}}>
                <div    style={{padding:"27px 5px 5px 0px"}}>
                <Button type="primary" onClick={()=> getDataOnSearch()} shape="circle" icon={<SearchOutlined />} />
                </div>
          </Col> */}
          </Row>
          <br/>
           <div className="responsivTable">
            <Table             
            size="middle"
            loading={isLoading}
            columns={columns} 
            dataSource={company.map((el: any, idx: any) => ({
                                key: idx,
                                ...el
                       }))}
            onChange={handleTableChange} 
            pagination={tableParams.pagination}           
                               />
           </div>                   
      </div>
  )
}

export default Company
