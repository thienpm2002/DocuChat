import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label" 
import { Button } from "@/components/ui/button"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"

import { useLogin, useSignUp } from "../hooks"

const AuthForm = ({ fields, schema, formType }) => {

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
   } = useForm({
        resolver: zodResolver(schema)
   })

  const mutation = (formType === "Login") ? useLogin() : useSignUp();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await mutation.mutateAsync(data);
      
      navigate("/documents");

      toast.success(`${formType} successfully`);
    }catch(error){
      if ( error.response?.data?.code === "INVALID_CREDENTIALS"){
        setError('root', { message: 'Email or password is incorrect' })
      } if(error.response?.data?.code === "EMAIL_ALREADY_EXISTS"){
        setError('root', { message: 'Email already exists' })
      } else {
        toast.success(`${formType} failed`)
      }
    }
  }

  return (
    <form 
        className="border-2 border-black rounded-2xl p-4"
        onSubmit={handleSubmit((data) => onSubmit(data))}
    >
      {
        fields.map((field, index) => 
            <div key={index}>

              <Label 
                htmlFor={field.name}
                className="font-bold"
              >
                {field.label}
              </Label>

              <Input
                {...register(field.name)} 
                id={field.name} 
                type={field.type} 
                placeholder={field.placeholder}
                className="my-4 px-4 py-2"
              />
              {errors[field.name] && <p className="text-red-500 text-sm mb-4">{errors[field.name].message}</p>}
            </div>
        )
      }

      {errors.root && <p className="text-red-500 text-sm my-2">{errors.root.message}</p>}
      
      <Button type='submit' disabled={mutation.isPending} className="w-full cursor-pointer">{mutation.isPending ? 'Loading...' : formType}</Button>
    </form>
  )
}

export default AuthForm
