"use client";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";
import formatDate, { sortByDate } from "@/app/utils/formateDate";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import TitleHeader from "@/app/(admin)/components/title-header";
import { useAuth } from "@/app/utils/authContext";
import { createProtectedApi } from "@/lib/apiCalls";
import { Order } from "@/types";
import { toast } from "react-hot-toast";

const TableOrders = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 5;
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const protectedApi = user ? createProtectedApi(user.token) : null;

  const { data, isLoading, error } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!protectedApi) throw new Error("Not authenticated");
      const data = await protectedApi.admin.getAllOrders();
      return sortByDate(data);
    },
    enabled: !!protectedApi
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: Order['status'] }) => {
      if (!protectedApi) throw new Error("Not authenticated");
      return await protectedApi.admin.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success("Order status updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update order status");
    }
  });

  const offset = currentPage * productsPerPage;
  const currentProducts = data?.slice(offset, offset + productsPerPage);

  const handlePageClick = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  if (isLoading) return <Spinner />;
  if (error) return <p>Something went wrong!</p>;

  return (
    <>
      <TitleHeader
        title="Orders"
        count={data?.length}
        description="Manage orders for your store"
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>Products</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProducts?.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.items.length} items</TableCell>
                <TableCell>${order.totalPrice}</TableCell>
                <TableCell>{order.shippingAddress}</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onChange={(e) => updateStatusMutation.mutate({
                      orderId: order._id,
                      status: e.target.value as Order['status']
                    })}
                    size="small"
                  >
                    <MenuItem value="Chờ thanh toán">Chờ thanh toán</MenuItem>
                    <MenuItem value="Chờ xử lý">Chờ xử lý</MenuItem>
                    <MenuItem value="Đang giao">Đang giao</MenuItem>
                    <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
                    <MenuItem value="Đã hủy">Đã hủy</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>{formatDate(new Date(order.createdAt).toISOString())}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {data && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
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
};

export default TableOrders;
