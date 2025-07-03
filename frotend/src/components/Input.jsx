import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'

const Input = ({ value, onChange, type = 'text', placeholder, label }) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const isPassword = type === 'password'

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-slate-800 mb-1">
          {label}
        </label>
      )}

      <div className="input-box relative flex items-center">
        <input
          type={isPassword && !showPassword ? 'password' : 'text'}
          className="w-full bg-transparent outline-none text-sm text-gray-800"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        {isPassword && (
          <span
            className="ml-2 cursor-pointer text-gray-600"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </span>
        )}
      </div>
    </div>
  )
}

export default Input
