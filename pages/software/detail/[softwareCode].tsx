import type { NextPage } from 'next'
import {useState,useEffect} from "react"
import { Col, Row,Card,Button,Table, Tag,Space,Divider,Collapse } from 'antd';
import styles from "./detail.module.scss"
import { useSelector } from 'react-redux';
import Link from 'next/link';
import api from "../../../src/restApi/index";
import { useRouter } from 'next/router';
import moment from "moment";
import {TeamOutlined,MailOutlined,LinkOutlined,PhoneOutlined,UserOutlined} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table'
const { Panel } = Collapse;
interface DataType {
    key: string;
    id : number;
    softwareName: string;
    releaseDttm: number;
    version: string;
    description: string;
    phoneNumber: string;
    softwareCode: string;
    currentVersionFlag:number;
  }
  const columns: ColumnsType<DataType> = [
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
            {/* <Link href={`/software/detail/${record.softwareCode}`} > 
           <Button shape="circle" icon={<InfoOutlined />} /> 
           </Link>
          <Link href={`/software/${record.id}`} > 
           <Button shape="circle" icon={<EditOutlined />} />
            </Link> */}
              <Tag color={record.currentVersionFlag ? "green": "red"} >
           {record.currentVersionFlag ? "Current" : "Old"}
        </Tag>
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
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Software type',
      dataIndex: 'softwareTypeName',
      key: 'softwareTypeName',
    },
   
   
  ];
const apiobj = new api();
const SoftwareEdit: NextPage = () => {
    const router = useRouter()
    const { softwareCode } = router.query
    const [isLoading,setIsLoading] = useState(false);
    const [softwarelist,setSoftwareslist] = useState<any>([]);
    const [companyInfo,setCompanyInfo] = useState<any>({});
    const userData = useSelector((state:any) => state.login.userinfo);
      useEffect(()=>{
        getSoftwaresListbySoftwareCode();
     },[softwareCode])
     const getSoftwaresListbySoftwareCode= async()=>{
       console.log("useEffect called",userData.id)
       if(userData.id){
           setIsLoading(true);
           console.log(userData.id)
           try {
             const response: any = await apiobj.request("software/listbysoftwarecode", {"userId": userData.id,"softwareCode":softwareCode}, "post");
             setSoftwareslist(response.data.list)
             setCompanyInfo(response.data.company)
             setIsLoading(false);
           }catch(error: any){
             setIsLoading(false);
           }
         
       }
     }
  return (
      <div className='space-Top'>
          <h2>Software Detail

            <Link href="/software" >
            <Button type="primary" style={{float:"right"}}>Back</Button>
                </Link>
            </h2>
       <Row>
       <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 18 }} 
        lg={{ span: 18 }}  xl={{ span: 17 }} xxl={{ span: 17 }}>
            <div className={styles.spaceCard}>
                <Card title="Software" style={{ width: '100%' }}>
                  {
                    softwarelist.length > 0 ?
                      <div>
                        <h3 className={styles.softwareInfo}>
                          Name: <label>{softwarelist[0].softwareName}</label>
                        </h3>
                        <h3 className={styles.softwareInfo}>
                          Software Code: <label>{softwareCode}</label>
                        </h3>
                        <Divider orientation="left">API</Divider>
                        <h3><Tag color="#2db7f5">POST</Tag> /api/checkversion</h3>
                        <h4 style={{fontWeight: 400}}>Description: This API is used in your software to determine whether an user has an old version or not. If the version is old, then you can show a popup.</h4>
                        <Collapse defaultActiveKey={['1']} ghost>
                              <Panel header="Request body (Object)" key="1">
                                <p className={styles.requestBody}> 
                                  <div>
                                    <label>softwareCode (string)</label>   <label> - Code of software e.g {softwareCode}</label>
                                  </div>
                                  <div>
                                    <label>version (string)</label>    <label> - Version of software e.g 0.0.1</label>
                                  </div>
                                </p>
                              </Panel>
                              <Panel header="Responses (Object)" key="2">
                              <p className={styles.requestBody}>
                              <Tag color="#87d068">200</Tag>OK 
                                  <div>
                                    <label>flag (boolean)</label>   <label> - If the software version is old, then the flag's value is 1. If the software version is current, then the flag's value is 0. </label>
                                  </div>
                                  <div>
                                    <label>currentVersion (string)</label>   <label> - Version of software. e.g 0.0.2</label>
                                  </div>
                                  <div>
                                    <label>description (string)</label>    <label> - Description of software. </label>
                                  </div>
                                </p>
                              </Panel>
                             
                            </Collapse>
                      </div>
                    :null
                  }
                  
                </Card>
                <br/>
                <div className="responsivTable">
                    <Table 
                    loading={isLoading}
                    columns={columns} dataSource={softwarelist.map((el: any, idx: any) => ({
                                        key: idx,
                                        ...el
                                    }))} />
                </div>     
          </div>
        </Col>
        <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 6 }} 
        lg={{ span: 6 }}  xl={{ span: 7 }} xxl={{ span: 7 }}>
            <div className={styles.spaceCard}>
                <Card title="Company" style={{ width: '100%' }}>
                <div className={styles.labelCompany}><TeamOutlined /> <label>{companyInfo.companyName}</label></div> <br/>
                <div className={styles.labelCompany}><UserOutlined /> <label>{companyInfo.contactPerson}</label></div> <br/>
                <div className={styles.labelCompany}><MailOutlined /> <label>{companyInfo.email}</label></div> <br/>
               { companyInfo.websiteUrl  ?  <div className={styles.labelCompany}><LinkOutlined /> <label>{companyInfo.websiteUrl}</label></div>: null } <br/>
               { companyInfo.phoneNumber  ?  <div className={styles.labelCompany}><PhoneOutlined /> <label>{companyInfo.phoneNumber}</label></div> : null } <br/>
                </Card>
              
            
            </div>
         
        </Col>
        
        {/* <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 6 }} 
        lg={{ span: 6 }}  xl={{ span: 7 }} xxl={{ span: 7 }}>
          
        </Col> */}
     </Row>
     <br/>
    </div>
  )
}

export default SoftwareEdit;
