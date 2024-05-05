import React, { useEffect, useState } from 'react'
import * as yup from 'yup'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const pizzaSchema = yup.object().shape({
  fullName:
    yup.string().min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required(),

  size:
    yup.string().oneOf(['S','M','L'],
    validationErrors.sizeIncorrect)
    .required(),
})




// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

const sizes = [
  { size: "S", text: 'small'},
  { size: "M", text: 'medium'},
  { size: "L", text: 'large'},
]

export default function Form() {
  const [size, setSize] = useState('')
  const [fullName, setfullName] = useState('')
  const [formState, setFormState] = useState({fullName,size});
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true)
  const [submitStatus, setSubmitStatus] = useState('')

  useEffect(() => {
    console.log(formState)
    pizzaSchema.isValid(formState).then(valid => 
      setDisabled(!valid));
  }, [formState])

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    if (name === 'fullName') {
      setfullName(value)
    } else if (name === "size") {
      setSize(value)
    }
    setFormState({
      ...formState,
      [name]: value,
    });

    yup.reach(pizzaSchema, name)
    .validate(value)
    .then(() => setErrors({ ...errors, [name]: ''}))
    .catch((err) => setErrors({...errors, [name]: err.errors[0]}))
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
  
    pizzaSchema.validate(formState)
    .then((res) => {
      console.log(res)
      setSubmitStatus('success')

    })
    .catch((err) => {
      console.error(err);
      setSubmitStatus('failure')
    })
  }
  
  
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {submitStatus === 'success' && <div className='success'>Thank you for your order, {fullName}! Your {size}</div>}
      {submitStatus === 'failure' && <div className='failure'>Something went wrong</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input value={fullName} onChange={handleChange} placeholder="Type full name" id="fullName" name='fullName'type="text" />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" value={size} onChange={handleChange} name='size'>
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
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
