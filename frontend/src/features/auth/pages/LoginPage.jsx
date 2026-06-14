import AuthForm from "../components/AuthForm"

import { Link } from "react-router-dom";
import { z } from 'zod'

const fields = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
  },
];

const loginSchema = z.object({
  email: z.string().max(255, 'Maximum 255 characters').email().trim(),
  password: z.string().min(8, "Minimum 2 characters required").max(128, "Maximum 128 characters").trim(),
}) 

const LoginPage = () => {

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
        <p className="text-sm font-medium text-gray-400">Login to continue to your account</p>
      </div>

      <AuthForm 
        fields={fields} 
        schema={loginSchema}
        formType="Login"
      />

      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-gray-400">
          Don't have an account? 
          <Link to="/auth/sign-up">
            <strong className="text-black"> Sign up</strong>
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
