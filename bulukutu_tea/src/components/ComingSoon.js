import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className='container p-5'>
        <div className='container text-center m-5'>
            <h1>Page coming soon!!</h1>
            <Link to="/" className="btn btn-outline-dark" >Back to Homepage</Link>
        </div>
    </div>
    
  )
}