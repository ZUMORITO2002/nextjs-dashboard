"use client"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Chart from "chart.js/auto";
import { useRef, useState, useEffect } from "react";
import { Form } from "@/components/ui/form";
import {
 Select,
 SelectContent,
 SelectGroup,
 SelectItem,
 SelectLabel,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { Button } from "../button";

const profileFormSchema = z.object({
 year: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type SalaryDataItem = {
 month: number;
 salary: number;
};

export default function EditEmployeeForm({ salaryId }: { salaryId: string }) {
 const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
 });

 const canvasRef = useRef<HTMLCanvasElement | null>(null);
 const chartRef = useRef<Chart | null>(null);

 const [chartData, setChartData] = useState<{ labels: number[]; datasets: { label: string; data: number[]; backgroundColor: string; borderColor: string; borderWidth: number; }[]; }>({
    labels: [],
    datasets: [
      {
        label: "Salary",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
 });

 useEffect(() => {
    if (canvasRef.current) {
      // Destroy existing chart if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      // Create new chart
      const newChart = new Chart(canvasRef.current, {
        type: 'line',
        data: chartData,
        options: {}
      });

      chartRef.current = newChart;
    }
 }, [chartData]);

 const onSubmit = async (data: ProfileFormValues) => {
    try {
      const response = await fetch(`http://localhost:8000/get_salary_data/${data.year}/${salaryId}`);
      const salaryData: SalaryDataItem[] = await response.json();

      const newChartData = {
        labels: salaryData.map((item) => item.month),
        datasets: [
          {
            label: "Salary",
            data: salaryData.map((item) => item.salary),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      };

      setChartData(newChartData);
    } catch (error) {
      console.error("Error fetching salary data:", error);
    }
 };

 return (
    <Form {...form}>
      <Select {...form.register("year")}>
        <SelectTrigger>
          <SelectValue placeholder="Select a Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Year</SelectLabel>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2021">2021</SelectItem>
            <SelectItem value="2020">2020</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
        Submit
      </Button>
      <div>
        <canvas ref={canvasRef} />
      </div>
    </Form>
 );
}
