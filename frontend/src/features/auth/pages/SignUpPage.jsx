import AuthForm from "../components/AuthForm"

import { Link } from "react-router-dom";
import { z } from 'zod'

const SignUpPage = () => {

  const fields = [
    {
      name: "userName",
      label: "Full name",
      type: "text",
      placeholder: "Your full name",
    },
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
    {
      name: "confirmPassword",
      label: "Confirm password",
      type: "password",
      placeholder: "Confirm your password",
    },

  ];

  const signUpSchema = z.object({
    userName: z.string().min(2, 'Minimum 2 characters required').max(30, "Maximum 30 characters").trim(),
    email: z.string().max(255, 'Maximum 255 characters').email().trim(),
    password: z.string().min(8, "Minimum 2 characters required").max(128, "Maximum 128 characters").trim(),
    confirmPassword: z.string(),
  }).refine(
    d => d.password === d.confirmPassword,
    { message: "Password doesn't match", path: ['confirmPassword'] }
  ) 

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Create your account</h2>
        <p className="text-sm font-medium text-gray-400">Sign up to get started with Docuchat</p>
      </div>

      <AuthForm 
        fields={fields} 
        schema={signUpSchema}
        formType="Sign up"
      />

      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-gray-400">
          Already have an account?  
          <Link to="/auth/login">
            <strong className="text-black"> Login</strong>
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUpPage
