"use client";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Spinner from "@/components/Spinner";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import formatDate, { sortByDate } from "@/app/utils/formateDate";
import formatVND from "@/app/utils/formatCurrency";
import TitleHeader from "@/app/(admin)/components/title-header";
import { useAuth } from "@/app/utils/authContext";
import { createProtectedApi, publicApi } from "@/lib/apiCalls";
import { Product } from "@/types";

type createData = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  createdAt: string;
};

export default function ProductTable() {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 10;
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const protectedApi = user ? createProtectedApi(user.token) : null;

  const { error, data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const result = await publicApi.getAllProducts({ limit: 100 });
      const sortedData = sortByDate(result.products);
      return sortedData as Product[];
    },
  });

  const deleteProduct = async (id: string) => {
    if (!protectedApi) return;

    try {
      await protectedApi.admin.deleteProduct(id);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const offset = currentPage * productsPerPage;
  const currentProducts = data?.slice(offset, offset + productsPerPage);

  const handlePageClick = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  const formatCreatedAt = (date: Date | undefined) => {
    return date ? formatDate(date.toString()) : 'N/A';
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Something went wrong!</p>;
  }

  return (
    <>
      <TitleHeader
        title="Products"
        count={data?.length}
        description="Manage products for your store"
        url="/admin/products/new"
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width={5}>
                <p className="text-gray-700">Image</p>
              </TableCell>
              <TableCell>
                <p className="text-gray-700">Name</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Categories</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Price</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Description</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Date</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Actions</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProducts?.map((product: Product) => (
              <TableRow
                key={product._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Image
                    src={product.image}
                    alt="Product Image"
                    className="border rounded-sm"
                    width={60}
                    height={60}
                  />
                </TableCell>
                <TableCell align="left">{product.name}</TableCell>
                <TableCell align="center">{product.category}</TableCell>
                <TableCell align="center">{formatVND(product.price)}</TableCell>
                <TableCell align="center">
                  {product.description.slice(0, 11)}
                  {product.description.length > 12 && "..."}
                </TableCell>
                <TableCell align="center">
                  <p>{formatCreatedAt(product.createdAt)}</p>
                </TableCell>
                <TableCell align="center">
                  <button>
                    <DeleteIcon
                      onClick={() => deleteProduct(product._id)}
                      className="text-red-600"
                    />
                  </button>
                  <Link href={`/admin/products/${product._id}`}>
                    <EditIcon />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {data && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={Math.ceil(data?.length / productsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination flex space-x-2 justify-end mt-4"}
          previousLinkClassName={"bg-neutral-800 px-4 py-2 rounded text-white"}
          nextLinkClassName={"bg-neutral-800 px-4 py-2 rounded text-white"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
          activeClassName={"bg-blue-700"}
          pageClassName="hidden"
        />
      )}
    </>
  );
}
