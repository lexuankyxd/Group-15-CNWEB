import TitleHeader from "@/app/(admin)/components/title-header";
import React from "react";
import NewUser from "../components/new-user";

const NewUserPage = () => {
  return (
    <div className="p-4 mt-2 w-3/4 max-md:w-full mx-auto">
      <TitleHeader title="Create new User" description="Create a new user" />
      <NewUser />
    </div>
  );
};

export default NewUserPage;
