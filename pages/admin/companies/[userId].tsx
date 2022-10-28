import type { NextPage } from 'next'
import Link from 'next/link'
import {useState,useEffect} from "react"
import {Col, Row, Button ,Space, Table, Input } from 'antd';
import api from "../../../src/restApi/index";
import type { ColumnsType } from 'antd/es/table'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import moment from "moment";
import useDidMountEffectWithSearchDelay  from "../../../src/customHooks/useDidMountEffectWithSearch"
import { GetServerSideProps } from 'next'

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

const CompanyAndUser: NextPage = ({data}:any) => {
  const [company,setCompany] = useState(data.company ? data.company : []);
  const [userInfo,setUserInfo] = useState<any>(data.userInfoo ? data.userInfoo : {});
  const [isLoading,setIsLoading] = useState(false);
  const [filterCompanyName,setFilterCompanyName] = useState("");
  const [filterContactPerson,setFilterContactPerson] = useState("");
  const [filterEmail,setFilterEmail] = useState("");
  console.log("userInfo",userInfo)
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showQuickJumper:true,
      total: data.count ? data.count : 0,
      responsive:true,
      showLessItems:true,
      showTotal:(total:any, range:any) => `${range[0]}-${range[1]} of ${total} items`
    },
  });
  const userData = useSelector((state:any) => state.login.userinfo);
  const router = useRouter();
  const { userId } = router.query
  useDidMountEffectWithSearchDelay(() => {
      getDataOnSearch();
  }, [filterCompanyName,filterContactPerson,filterEmail])

const getDataOnSearch = async() => {
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

  const getCountCompanyList = async() => {
        if(userData.id){
          try {
            const response: any = await apiobj.request("company/companiesbyuid",
                        { "userId": userId,"count":true,
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
          {"userId": userId,"offset":offsetValue,
           "email" : filterEmail,
           "contactPerson": filterContactPerson,
           "companyName":filterCompanyName,
           "limit":tableParams.pagination.pageSize
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
    pager.pagination.pageSize = pagination.pageSize;
    pager.pagination.current = pagination.current;
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
    }
  ];
  return (
      <div className='space-Top'>
        <h2>User and Company Details

        <Link href="/admin/users" >
           <Button type="primary" style={{float:"right"}}>Back</Button>
            </Link>
        </h2>
           <br/>
           <h3>Name: <span>{userInfo ? ""+userInfo.firstName+" "+userInfo.lastName : null}</span> </h3>
           <h3>Email: <span>{userInfo ? userInfo.email : null}</span> </h3>
           <h3>Last logged: <span>{userInfo.lastLoggedDttm ? moment(new Date(parseInt(userInfo.lastLoggedDttm))).format("MM/DD/YYYY hh:mm A")   : null}</span> </h3>
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

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async (context) => {
  
  var company:any = [];
  var userInfo:any = {};
  var count:any = 0;
  let userId = context.params?.userId;
  // Fetch data from external API
    try {
      const responseUser: any = await apiobj.request("users/"+userId+"",{}, "get",context.req.cookies['token']);
        userInfo =responseUser.data[0];
      const responseCount: any = await apiobj.request("company/companiesbyuid",
      { "userId": userId,"count":true}, 
      "post" ,context.req.cookies['token']);
        count= responseCount.data[0].count || 0;
      const responseCompany: any = await apiobj.request("company/companiesbyuid", 
      {"userId": userId,"offset":0}, "post" ,context.req.cookies['token']);
        company=responseCompany.data
    }catch(error: any){
    }
  // var  cookies1 = context.req.headers.cookie;
 
 var data:any = {
  "company":company,
  "userInfoo":userInfo,
  "count":count
 }
  // Pass data to the page via props
  return { props: { data } }
}
export default CompanyAndUser
