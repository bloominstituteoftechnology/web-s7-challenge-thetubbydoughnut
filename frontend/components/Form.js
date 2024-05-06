import React, { useEffect } from 'react'
import * as yup from 'yup'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

// 👇 Here you will create your schema.
const pizzaSchema = yup.object().shape({
  fullName: yup.string()
    .required(validationErrors.fullNameTooShort)
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong),

  size: yup.string()
    .required(validationErrors.sizeIncorrect)
    .oneOf(['S','M','L'], validationErrors.sizeIncorrect),
  ...toppings.reduce((acc, topping) => ({ ...acc, [topping.text]: yup.boolean() }), {}),
});

const sizes = [
  { size: "S", text: 'Small'},
  { size: "M", text: 'Medium'},
  { size: "L", text: 'Large'},
]

const initialFormState = {
  fullName: '',
  size: '',
  ...toppings.reduce((acc, topping) => 
    ({ ...acc, [topping.text]: false}), {}),
};

export default function Form({ 
  size, setSize,
  fullName,setfullName,
  formState, setFormState,
  errors, setErrors,
  disabled, setDisabled,
  submitStatus, setSubmitStatus,
  submittedData, setSubmittedData,
  touched, setTouched
}) {

  useEffect(() => {
    pizzaSchema.isValid(formState).then(valid => 
      setDisabled(!valid));
  }, [formState])

  useEffect(() => {
    for(let field in formState) {
      validateField(field, formState[field])
    }
  },[size])

  useEffect(() => {
    for(let field in formState) {
      validateField(field, formState[field])
    }
  },[fullName])
  
  const handleChange = React.useCallback(
    (evt) => {
      const { name, value, checked, type } = evt.target;
      const valueToUpdate = type === 'checkbox' ? checked : value;
      
      setFormState(prevState => {
        const newState = { ...prevState, [name]: valueToUpdate };
        validateField(name,valueToUpdate)
        return newState;
      });
      
      setTouched(prevTouched => ({ ...prevTouched, [name]: true }))

      if (name === 'fullName') {
        setfullName(value)
      }
      
      if (name === 'size') {
        setSize(value)
      }
    },[]);
    
    // const debounce = (func, delay) => {
    //   let debounceTimer;
    //   return function() {
    //     const context = this;
    //     const args = arguments;
    //     clearTimeout(debounceTimer);
    //     debounceTimer = setTimeout(() => func.apply(context, args),delay);
    //   }
    // }

    const validateField = (name, value) => {
      if(!touched[name]) {
        return;
      }
      let error = '';
      try { yup.reach(pizzaSchema, name)
      .validateSync(value);
      }
      catch (err) { error = err.errors
      }
      setErrors(prevErrors => (
        {...prevErrors, [name]: error }))
      }

    const handleSubmit = React.useCallback(
      (evt) => {
        evt.preventDefault();
        try {
        pizzaSchema.validateSync(formState)
         
        setSubmitStatus('success')
        setSubmittedData(formState)
        setFormState({
          fullName: '', 
          size: '',
          ...toppings.reduce((acc, topping) => ({...acc, [topping.text]: false}), {}),
        });
        setTouched({})
        setSize(''),
        setfullName('')
      }
      catch (err) {
        console.error(err);
        setSubmitStatus('failure')
      }
    }, [formState, pizzaSchema]);
  

    let toppingMessage = '' 
    if (submitStatus === 'success' && submittedData) {
      const numToppings = Object.values(submittedData).filter(value => value === true).length;
      if (numToppings > 1) {
         toppingMessage = `${numToppings} toppings`;
       } 
       else if (numToppings === 1) {
         toppingMessage = "1 topping";
       }
       else {
         toppingMessage = 'no toppings';
       }
    }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {submitStatus === 'success' && submittedData && <div className='success'>
      Thank you for your order, {submittedData.fullName}!
      Your {sizes.find(s => s.size === submittedData.size).text.toLowerCase()} 
       {' pizza with'} {toppingMessage} is on its way!
      </div>}
      {submitStatus === 'failure' && <div className='failure'>Something went wrong</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input value={fullName} onChange={handleChange}  placeholder="Type full name" id="fullName" name='fullName'type="text" />
        </div>
        {errors.fullName && errors.fullName !== '' && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" value={size} onChange={handleChange} name='size'>
            <option value="">----Choose Size----</option>
          {sizes.map((si, idx) => (
            <option key={idx} value={si.size}>{si.text}</option>
          ))}
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {toppings.map((topping, idx) => (
        <label key={idx}>
          <input
            name={topping.text}
            type="checkbox"
            checked={formState[topping.text]}
            onChange={handleChange}
          />
          {topping.text}<br />
        </label>
        ))}
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled={disabled} />
    </form>
  )
}
