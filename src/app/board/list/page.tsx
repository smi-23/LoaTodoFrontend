"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Container,
  Typography,
  Pagination,
  Stack,
} from "@mui/material";

const columns = [
  { id: "id", label: "글번호", minWidth: 30, align: "center" },
  { id: "title", label: "제목", minWidth: 500, align: "center" },
  { id: "author", label: "글쓴이", minWidth: 30, align: "center" },
  {
    id: "createdAt",
    label: "작성일",
    minWidth: 30,
    align: "center",
    format: (value: string) => {
      const date = new Date(value);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();

      if (isToday) {
        // 오늘이면 24시간 형식으로 시간만 표시
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // 24시간 형식
        });
      } else {
        // 오늘이 아니면 날짜만 표시
        return date.toLocaleDateString();
      }
    },
  },
  { id: "view", label: "조회", minWidth: 30, align: "center" },
];

const BoardListPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [boardList, setBoardList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // 페이지 번호를 URL에서 가져옵니다
  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    setPage(pageParam);
  }, [searchParams]);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
    router.push(`/board/list?page=${value}`);
  };

  useEffect(() => {
    const fetchBoardList = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/board/all");
        const data = response.data;

        if (data) {
          setBoardList(data.data);
          setTotalPages(Math.ceil(data.data.length / rowsPerPage));
        } else {
          // router.push("/404");
        }
      } catch (error) {
        console.error("Error fetching board data:", error);
      }
    };

    fetchBoardList();
  }, [rowsPerPage, page]);

  const createBoard = () => {
    if (status === "authenticated") {
      router.push("/board/write");
    } else {
      alert("로그인한 유저만 글을 쓸 수 있습니다.");
    }
  };

  const handleRowClick = (boardId: number) => {
    router.push(`/board/view/${boardId.toString()}`);
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          게시판
        </Typography>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={createBoard}
          >
            글쓰기
          </Button>
        </Box>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column?.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {boardList
                  .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                  .map((board) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={board.id}
                        onClick={() => handleRowClick(board.id)}
                      >
                        {columns.map((column) => {
                          const value = board[column.id];
                          return (
                            <TableCell key={column.id} align={column?.align}>
                              {column?.format && typeof value === "string"
                                ? column?.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent="center" p={2}>
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handleChangePage}
                showFirstButton
                showLastButton
              />
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default BoardListPage;
