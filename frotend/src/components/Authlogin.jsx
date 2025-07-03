import React from 'react'
import background from '../assets/images/background.jpg'

const AuthLogin = ({ children }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">

      {/* Left Login Section */}
      <div className="flex flex-col justify-center w-full md:w-[50%] px-8 md:px-16 lg:px-24 bg-white">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Task Management
        </h2>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          {children}
        </div>
      </div>

      {/* Right Background Section */}
      <div className="hidden md:block w-[50%] h-full">
        <img
          src={background}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  )
}

export default AuthLogin
