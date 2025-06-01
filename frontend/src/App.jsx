import { useState } from 'react'
import axios from 'axios'

export default function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const err = {}
    if (typeof form.name !== 'string' || !form.name.trim()) {
      err.name = 'Name is required'
    }
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
    if (typeof form.email !== 'string' || !emailRegex.test(form.email)) {
      err.email = 'Valid email is required'
    }
    if (form.company && form.company.length > 100) {
      err.company = 'Company must be ≤ 100 characters'
    }
    if (form.message && form.message.length > 500) {
      err.message = 'Message must be ≤ 500 characters'
    }
    return err
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length > 0) {
      setErrors(v)
      return
    }
    setErrors({})

    const payload = {
      username: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim() || null,
      message: form.message.trim() || null,
    };
    console.log('Sending to backend:', payload);

    try {
      const response = await axios.post(
        "http://localhost:3000" + '/api/leads',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if(response.status === "success")
      {
        alert("successfully lead is send")
      }
      
      setForm({ name: '', email: '', company: '', message: '' });

    } catch (err) {
      console.error('Error forwarding to n8n:', err)
      alert('Submission failed. Please try again later.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">Generate a Lead</h1>
        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <label className="block mb-1 font-medium">Name<span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}

          {/* Email */}
          <label className="block mt-4 mb-1 font-medium">Email<span className="text-red-500">*</span></label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}


          <label className="block mt-4 mb-1 font-medium">Company (optional)</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${errors.company ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}


          <label className="block mt-4 mb-1 font-medium">Message (optional)</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows="4"
            className={`w-full px-3 py-2 border rounded ${errors.message ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          ></textarea>
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}

          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-500 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
