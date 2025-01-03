import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
        <Image
          src="/logo.jpeg"
          alt="Store Logo"
          width={50}
          height={50}
          className="object-contain"
        />
      </Link>
    </div>
  );
};

export default Logo;
