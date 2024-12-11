"use client";
import { Customer } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type CustomerFormData = Omit<Customer, '_id' | 'createdAt' | 'updatedAt'>;

const NewCustomer = () => {
  const router = useRouter();
  const params = useParams();
  const customerId = params.customerId as string;

  const isEditMode = !!customerId;
  const initialState: CustomerFormData = {
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  };

  const [formData, setFormData] = useState<CustomerFormData>(initialState);
  const [errors, setErrors] = useState<Partial<CustomerFormData>>({});

  useQuery({
    queryKey: ["getCustomer", customerId],
    queryFn: async () => {
      if (!isEditMode) return;
      const { data } = await axios.get(`/api/customers/${customerId}`);
      setFormData({
        name: data.name,
        email: data.email,
        password: "",
        phone: data.phone || "",
        address: data.address || "",
      });
      return data;
    },
    enabled: isEditMode,
  });

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    if (!formData.email || !emailRegex.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email address." }));
      return;
    }

    if (!isEditMode && (!formData.password || !passwordRegex.test(formData.password))) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must have one uppercase letter, one number, and one special character.",
      }));
      return;
    }

    try {
      if (isEditMode) {
        await axios.put(`/api/customers/${customerId}`, formData);
        toast.success("User successfully updated.");
      } else {
        await axios.post("/api/customers", formData);
        toast.success("User successfully created.");
      }
      router.push("/admin/users");
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      <form onSubmit={onSubmitHandler}>
        <div className="flex gap-10 max-md:flex-col">
          <div className="flex flex-col gap-y-2">
            <label htmlFor="name" className="font-semibold">
              Name
            </label>
            <Input
              value={formData.name}
              type="text"
              name="name"
              id="name"
              required
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <Input
              value={formData.email}
              type="email"
              name="email"
              id="email"
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <Input
              value={isEditMode ? "********" : formData.password}
              disabled={isEditMode}
              type="password"
              name="password"
              id="password"
              required={!isEditMode}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
            <label htmlFor="phone" className="font-semibold">
              Phone
            </label>
            <Input
              value={formData.phone}
              type="tel"
              name="phone"
              id="phone"
              required
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <label htmlFor="address" className="font-semibold">
              Address
            </label>
            <Input
              value={formData.address}
              type="text"
              name="address"
              id="address"
              required
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>
        <Button type="submit" className="mt-4 px-7 bg-green-600" variant="default">
          {isEditMode ? "Edit" : "Create"}
        </Button>
      </form>
    </>
  );
};

export default NewCustomer;
