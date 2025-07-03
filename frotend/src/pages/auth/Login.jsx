import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Authlogin from '../../components/Authlogin'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    // TODO: Add login logic
  }

  return (
    <div>
      <Authlogin>
        <div className="space-y-4 text-gray-800">
          <h3 className="text-2xl font-semibold">Welcome to Noonain Studios</h3>
          <p className="text-sm text-gray-600">
            Please enter your credentials to log in
          </p>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </Authlogin>
    </div>
  )
}

export default Login
