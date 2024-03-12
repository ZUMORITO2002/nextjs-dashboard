"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { addCustomer } from "@/app/lib/actions"

const profileFormSchema = z.object({
  name: z
    .string(),

  email: z
    .string(),

  phone_number: z
    .string(),
})

 type ProfileFormValues = z.infer<typeof profileFormSchema>


export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
    },
  })
  


  function onSubmit(data: ProfileFormValues) {
    const submitForm = async () => {
      try {
        // Replace with your actual API call logic
        const response = await fetch('http://localhost:8000/create_customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error('Failed to submit form');
        }
  
        // Handle successful response (e.g., show success toast)
        toast({
          title: "Form submitted successfully!",
          description: "Customer added successfully!",
        });
        form.reset(); // Reset the form
      } catch (error) {
        // Handle errors (e.g., show error toast)
        toast({
          title: "Failed to submit form.",
          description: "Please check your input and try again.",
        });
      }
    };
  
    submitForm();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {/* {form.formState.errors.phone && (
                <FormMessage>{form.formState.errors.phone.message}</FormMessage>
              )} */}
            </FormItem>
          )}
        />


        <Button type="submit">Add Customer</Button>
      </form>
    </Form>
  )
}

