'use client';
import {z} from "zod";
import { useFormState } from 'react-dom';
import { MaterialsField } from '@/app/lib/definitions';
import { zodResolver } from "@hookform/resolvers/zod";
import {  useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createMaterial } from '@/app/lib/actions';
import { toast } from "@/components/ui/use-toast";


const materialFormSchema = z.object({
  material_name: z
    .string(),

  material_amount: z
    .string(),
})

type MaterialFormValues = z.infer<typeof materialFormSchema>

export default function MaterialForm() {
  // const initialState = { message: null, errors: {} };
  // const [state, dispatch] = useFormState(createMaterial, initialState);
  
  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialFormSchema),
    mode: "onChange",
    defaultValues: {
      material_name: "",
      material_amount: "",
    },
  })
  


  function onSubmit(data: MaterialFormValues) {
    const submitForm = async () => {
      try {
        // Replace with your actual API call logic
        const response = await fetch('http://localhost:8000/add_materials', {
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
        name="material_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Material Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      

      <FormField
        control={form.control}
        name="material_amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amount of materials</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            {/* {form.formState.errors.phone && (
              <FormMessage>{form.formState.errors.phone.message}</FormMessage>
            )} */}
          </FormItem>
        )}
      />


      <Button type="submit">Add Materials</Button>
    </form>
  </Form>
  );}