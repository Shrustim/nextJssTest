import type { NextPage } from 'next'
import Link from 'next/link'
import {useState,useEffect} from "react"
import {Col, Row, Button ,Space, Table, Input } from 'antd';
import api from "../../../src/restApi/index";
import type { ColumnsType } from 'antd/es/table'
import { useSelector } from 'react-redux';
import moment from "moment";
import { useRouter } from 'next/router';
import {InfoOutlined,EditOutlined } from '@ant-design/icons';
import { GetServerSideProps } from 'next'
import useDidMountEffectWithSearchDelay  from "../../../src/customHooks/useDidMountEffectWithSearch"

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
  apiCallsCount: number;
}

const Softwares: NextPage =  ({data}:any) => {
  const [software,setSoftwares] = useState(data.software ? data.software : []);
  const [isLoading,setIsLoading] = useState(false);
  const [companyInfo,setCompanyInfo] = useState<any>(data.companyInfo ? data.companyInfo : {});
  const [filterVersion,setFilterVersion] = useState("");
  const [filterSoftwareCode,setFilterSoftwareCode] = useState("");
  const [filterSoftwareName,setFilterSoftwareName] = useState("");
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
  const router = useRouter();
  const { companyId } = router.query
  const userData = useSelector((state:any) => state.login.userinfo);


  const getDataOnSearch = async() => {
        setIsLoading(true); 
        try {
            await getCountSoftwaresList();
            await getSoftwaresList(0);
            setIsLoading(false);
        }
        catch(error: any){
          setIsLoading(false);
        }
  }

  useDidMountEffectWithSearchDelay(() => {
    getDataOnSearch();
  },[filterVersion,filterSoftwareCode,filterSoftwareName])
  
  const getCountSoftwaresList = async() => {
        if(userData.id && companyId){
          try {
            const response: any = await apiobj.request("software/softwarebyCompany",
                        { "companyId": companyId,"count":true,
                          "softwareName" : filterSoftwareName,
                          "softwareCode": filterSoftwareCode,
                          "version":filterVersion
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
  const getSoftwaresList= async(offsetValue: number)=>{
     if(userData.id && companyId){
        try {
          const response: any = await apiobj.request("software/softwarebyCompany", 
          {"companyId": companyId,"offset":offsetValue,
           "softwareName" : filterSoftwareName,
           "softwareCode": filterSoftwareCode,
           "version":filterVersion,
           "limit":tableParams.pagination.pageSize
          }, "post");
          setSoftwares(response.data)
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
    var offset :number= ( pager.pagination.current -  1) * count;	
    setTableParams(pager);
    setIsLoading(true); 
    try {
      getSoftwaresList(offset);
      setIsLoading(false);
    }catch(error: any){
      setIsLoading(false);
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
    {
      title:"API Calls Count",
      dataIndex:"apiCallsCount",
      key:"apiCallsCount"
    }
   
   
  ];
  return (
      <div className='space-Top'>
        <h2>Company and Software Details

        <Link href="/admin/companies" >
           <Button type="primary" style={{float:"right"}}>Back</Button>
            </Link>
        </h2> 
        <br/>
           <h3>Company name: <span>{companyInfo ? companyInfo.companyName: null}</span> </h3>
           <h3>Contact person: <span>{companyInfo ? companyInfo.contactPerson : null}</span> </h3>
           <h3>Email: <span>{companyInfo? companyInfo.email :null}</span> </h3>
           <h3>Website URL: <span>{companyInfo ? companyInfo.websiteUrl : null}</span> </h3>
           <h3>Phone number: <span>{companyInfo ? companyInfo.phoneNumber: null }</span> </h3>
           
          
           <Row>
          <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 5 }} 
           lg={{ span: 5 }}  xl={{ span: 5}} xxl={{ span: 5 }}></Col>
            
             <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 6 }} 
           lg={{ span: 6 }}  xl={{ span: 6 }} xxl={{ span: 6 }}>
                <div    style={{padding:"5px 5px 5px 0px"}}>
                <label>Software Code:</label>
                  <Input placeholder="Software Code" value={filterSoftwareCode} 
                  onChange={(e) => { setFilterSoftwareCode(e.target.value)}}
                  style={{width:"100%"}} />
                </div>
            </Col>
             <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 6 }} 
           lg={{ span: 6 }}  xl={{ span: 6 }} xxl={{ span: 6 }}>
                <div    style={{padding:"5px 5px 5px 0px"}}>
                <label>Software Name:</label>
                  <Input placeholder="Software Name " value={filterSoftwareName} 
                  onChange={(e) => {setFilterSoftwareName(e.target.value)}}
                  style={{width:"100%"}} />
                </div>
          </Col>
          <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 6 }} 
           lg={{ span: 6 }}  xl={{ span: 6 }} xxl={{ span: 6 }}>
                <div    style={{padding:"5px 5px 5px 0px"}}>
                  <label>Version:</label>
                  <Input placeholder="Version " value={filterVersion} 
                   onChange={(e) => {setFilterVersion(e.target.value)}}
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
            columns={columns} dataSource={software.map((el: any, idx: any) => ({
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
  
  var software:any = [];
  var companyInfo:any = {};
  var count:any = 0;
  let companyId = context.params?.companyId;
  // Fetch data from external API
    try {
      const responseCompany: any = await apiobj.request("company/"+companyId+"",{}, "get",context.req.cookies['token']);
      companyInfo =responseCompany.data[0];
      const responseCount: any =await apiobj.request("software/softwarebyCompany", 
      { "companyId": companyId,"count":true}, 
      "post" ,context.req.cookies['token']);
        count= responseCount.data[0].count || 0;
      const responseSoftware: any = await apiobj.request("software/softwarebyCompany", 
      {"companyId": companyId,"offset":0}, "post" ,context.req.cookies['token']);
      software=responseSoftware.data
    }catch(error: any){
    }
  // var  cookies1 = context.req.headers.cookie;
 
 var data:any = {
  "software":software,
  "companyInfo":companyInfo,
  "count":count
 }
  // Pass data to the page via props
  return { props: { data } }
}
export default Softwares
