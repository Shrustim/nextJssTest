import React from 'react'
import {useRouter} from 'next/router';
function ErrorPage() {
  const router = useRouter()
  return (
    <div><br/><h1 style={{textAlign:"center"}}>We are sorry ,page not found :)</h1>
    <button type="button" className='errorBtn' onClick={() => router.push('/')}>Home</button>
    </div>
  )
}

export default ErrorPage