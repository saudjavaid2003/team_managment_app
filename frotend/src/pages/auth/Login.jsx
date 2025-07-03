import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Authlogin from '../../components/Authlogin'
import Input from '../../components/Input'
import { isValidEmail } from '../../utils/helper'
const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if(!validateemail){
      setError('Please enter a valid email address')
      return
    }
    if(!password){
      setError('Please enter your password')
      return
    }
    // TODO: Add login logic
  }

  return (
    <div>
      <Authlogin>
        <div className="w-full max-w-md pl-2 pr-6 pt-10 space-y-4 text-black">
          <h3 className="text-3xl font-bold mb-1">Welcome to Noonain Studios</h3>
          <p className="text-sm mb-4">
            Please enter your credentials to log in
          </p>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={setEmail}
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="bg-black text-white w-full py-2 rounded-md hover:cursor-pointer transition"
            >
              Login
            </button>
          </form>

          {/* Sign up suggestion */}
          <div className="text-sm text-center mt-6">
            <p className="mb-2">Don't have an account?</p>
            <button
              onClick={() => navigate('/')}
              className="w-full py-2 bg-black text-white rounded-md hover:bg-neutral-800 hover:cursor-pointer transition"
            >
              Sign up
            </button>
          </div>
        </div>
      </Authlogin>
    </div>
  )
}

export default Login
