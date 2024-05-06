import React, { useState } from 'react'
import Home from './Home'
import Form from './Form'
import { Link } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'




function App(initialFormState) {
  const [size, setSize] = useState('')
  const [fullName, setfullName] = useState('')
  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true)
  const [submitStatus, setSubmitStatus] = useState('')
  const [submittedData, setSubmittedData] = useState(null)
  const [touched, setTouched] = useState({})
  const [activeLink, setActiveLink] = useState('home');
  
  const clickHandler = (evt) => {
    setActiveLink(evt.target.name)
  }

  return (
    <div id="app">
      <nav>
        <Link to='/' name="home" className={activeLink === 'home' ? 'active' : ''} onClick={clickHandler}>Home</Link>
        <Link to='/order' name='order' className={activeLink === 'order' ? 'active' : ''} onClick={clickHandler}>Order</Link>
      </nav>
      <Routes>
        <Route path='*' element={<Home />} />
        <Route path='/order' element={<Form 
        size={size} setSize={setSize}
        fullName={fullName} setfullName={setfullName}
        formState={formState} setFormState={setFormState}
        errors={errors} setErrors={setErrors}
        disabled={disabled} setDisabled={setDisabled}
        submitStatus={submitStatus} setSubmitStatus={setSubmitStatus}
        submittedData={submittedData} setSubmittedData={setSubmittedData}
        touched={touched} setTouched={setTouched}
        />} />
      </Routes>
    </div>
  )
}

export default App
