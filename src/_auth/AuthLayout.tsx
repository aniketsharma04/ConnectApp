import React from 'react'
import { Outlet,Navigate } from 'react-router-dom'
const AuthLayout = () => {
  const isAuthenticated = false;
  return (
   <>
   {isAuthenticated ? (
    <Navigate to="/" />
  ): (
    <>
    <section className="flex flex-1 justify-center items-center flex-colpy-10">
      <Outlet/>
    </section>
    <img
            src="/assets/images/side2-img.jpeg"
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
    </>
  )}
   </>
  )
}

export default AuthLayout