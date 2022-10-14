import React from 'react'
import {useRouter} from 'next/router';
import { Button, Result } from 'antd';
function ErrorPage() {
  const router = useRouter()
  return (
    <div>
      
      <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button type="primary" onClick={() => router.push('/')}>Back Home</Button>}
  />
      {/* <br/><h1 style={{textAlign:"center"}}>We are sorry ,page not found :)</h1>
    <button type="button" className='errorBtn' onClick={() => router.push('/')}>Home</button> */}
    </div>
  )
}

export default ErrorPage