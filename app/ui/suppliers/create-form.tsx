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

const SupplierFormSchema = z.object({
  supplier_name: z
    .string(),

  email: z
    .string(),

  phone: z
    .string(),

  rating: z.string(),
})

 type SupplierFormValues = z.infer<typeof SupplierFormSchema>


export function SupplierForm() {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(SupplierFormSchema),
    mode: "onChange",
    defaultValues: {
      supplier_name: "",
      email: "",
      phone: "",
      rating: "",
    },
  })
  


  function onSubmit(data: SupplierFormValues) {
    const submitForm = async () => {
      try {
        // Replace with your actual API call logic
        const response = await fetch('http://localhost:8000/create_suppliers', {
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
          description: "Supplier added successfully!",
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
          name="supplier_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier name</FormLabel>
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
          name="phone"
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
          <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Add Supplier</Button>
      </form>
    </Form>
  )
}