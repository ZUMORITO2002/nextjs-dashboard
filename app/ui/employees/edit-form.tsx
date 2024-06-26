"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";

// ... other imports
import { zodResolver } from "@hookform/resolvers/zod"

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

// const employeeFormSchema = z.object({
//   id: z.string(),
//   name: z.string(),
//   address:z.string(),
//   phone_number: z.string(),
// });

// type EmployeeFormValues = z.infer<typeof employeeFormSchema>

export default function EditEmployeeForm({ employeeId }: {  employeeId: string }) {
  console.log("i am not gay", employeeId)
  const form = useForm({
    mode: "onChange",
    defaultValues: async () => {
      try {
        console.log(employeeId)
        const response = await fetch(`http://localhost:8000/get_employees/${employeeId}`);
  
        if (!response.ok) {
          throw new Error("Failed to fetch  employee data");
        }
  
        const employeeData = await response.json();
        console.log("this is id ", employeeData.id)
        return {
          id:  employeeData.id, // Ensure ID is included in the returned object
          name:  employeeData.name,
          address:  employeeData.address,
          phone_number:  employeeData.phone_number,
        };
        return employeeData; // Return the fetched customer data
      } catch (error) {
        console.error("Error fetching customer data:", error);
        // Handle errors (e.g., show error message)
        return {
          id:"",
          name: "",
          address: "",
          phone_number: "", // Set defaults if fetching fails
        };
      }
    },
  });

  async function onSubmit(data: any ) {
    console.log("Button Was Clicked")
    try {
      const response = await fetch(`http://localhost:8000/update_employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update  employee");
      }

      // Handle successful response (e.g., show success toast)
      toast({
        title: " Employee updated successfully!",
        description: " Employee information has been updated.",
      });
      // Navigate back or handle success as needed
    } catch (error) {
      // Handle errors (e.g., show error toast)
      toast({
        title: "Failed to update  employee",
        description: "Please try again or contact support.",
      });
    }
  }

  return (
    <Form {...form}>
      {/* Form fields for name, email, phone_number (same as create-customer) */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
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

      <Button type="submit">Update Employee</Button>
      </form>
    </Form>
  );
} 