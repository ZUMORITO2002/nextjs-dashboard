"use server"

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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const profileFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  address:z.string(),
  phone_number: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default async function EditEmployeeForm({ salaryId }: {  salaryId: string }) {
  console.log("i am not gay", salaryId)
  // const form = useForm<ProfileFormValues>({
  //   resolver: zodResolver(profileFormSchema),
  //   mode: "onChange",
  //   defaultValues: async () => {
  //     try {
  //       console.log(salaryId)
  //       const response = await fetch(`http://localhost:8000/get_salary/${salaryId}`);
  
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch  employee data");
  //       }
  
  //       const salaryData = await response.json();
  //       console.log("this is id ", salaryData.id)
  //       return {
  //         id:  salaryData.id, // Ensure ID is included in the returned object
  //         name:  salaryData.name,
  //       };
  //       return salaryData; // Return the fetched customer data
  //     } catch (error) {
  //       console.error("Error fetching customer data:", error);
  //       // Handle errors (e.g., show error message)
  //       return {
  //         id:"",
  //         name: "",

  //       };
  //     }
  //   },
  // });

  // async function onSubmit(data: ProfileFormValues) {
  //   console.log("Button Was Clicked")
  //   try {
  //     const response = await fetch(`http://localhost:8000/update_employees`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(data),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to update  employee");
  //     }

  //     // Handle successful response (e.g., show success toast)
  //     toast({
  //       title: " Employee updated successfully!",
  //       description: " Employee information has been updated.",
  //     });
  //     // Navigate back or handle success as needed
  //   } catch (error) {
  //     // Handle errors (e.g., show error toast)
  //     toast({
  //       title: "Failed to update  employee",
  //       description: "Please try again or contact support.",
  //     });
  //   }
  // }

  return (
    <Select>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select a Year" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Year</SelectLabel>
        <SelectItem value="2023">2023</SelectItem>
        <SelectItem value="2022">2022</SelectItem>
        <SelectItem value="2021">2021</SelectItem>
        <SelectItem value="2020">2020</SelectItem>
        <SelectItem value="2019">2019</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
  );
} 