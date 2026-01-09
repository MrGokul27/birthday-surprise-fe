import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Box,
} from "@mui/material";
import React, { useMemo, useState } from "react";

export type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  rowsPerPageOptions?: number[];
};

export default function CommonTable<T>({
  columns,
  data,
  emptyMessage = "No records found",
  rowsPerPageOptions = [5, 10, 25],
}: Props<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [search, setSearch] = useState("");

  // 🔍 Filter data by search
  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((row) =>
      columns.some((col) => {
        const value = (row as any)[col.key];
        return value?.toString().toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [search, data, columns]);

  // 📄 Paginated data
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  return (
    <Box>
      {/* 🔍 Search */}
      <Box mb={2} display="flex" justifyContent="flex-end">
        <TextField
          size="small"
          label="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
      </Box>

      <Table>
        <TableHead sx={{ backgroundColor: "#fbece6ff" }}>
          <TableRow>
            {columns.map((col, index) => (
              <TableCell key={index}>{col.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex}>
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* 📄 Pagination */}
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </Box>
  );
}
