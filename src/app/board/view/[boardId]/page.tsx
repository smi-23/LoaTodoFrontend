"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { backend_api } from "@/app/utils";

const BoardDetailPage = () => {
  const { boardId } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [board, setBoard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoardDetail = async () => {
      if (!boardId) return; // boardId가 없으면 요청하지 않음
      try {
        const response = await backend_api().get(
          `http://localhost:8080/api/board/${boardId}`,
        );
        setBoard(response.data.data);
      } catch (error) {
        setError("게시글을 불러오는 데 오류가 발생했습니다.");
        console.error("Error fetching board detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardDetail();
  }, [boardId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!board) return <Typography>게시글을 찾을 수 없습니다.</Typography>;

  const isAuthor = session?.user?.username === board.author; // 세션 유저와 게시글 저자 비교

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" component="h1" gutterBottom>
          게시글 상세
        </Typography>
        <Paper sx={{ width: "100%", p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {board.title}
          </Typography>
          {/* Title and Metadata Box */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="subtitle1" color="textSecondary">
              {board.author} | {new Date(board.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              조회수: {board.view}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" sx={{ minHeight: 200 }}>
            {board.content}
          </Typography>
          {/* 조건에 따라 수정 및 삭제 버튼 표시 */}
          {isAuthor && (
            <Box mt={2} align={"right"}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 1 }}
                // onClick={() => router.push(`/board/edit/${board.id}`)}
              >
                수정
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={async () => {
                  if (confirm("정말로 삭제하시겠습니까?")) {
                    try {
                      await backend_api().delete(
                        `http://localhost:8080/api/board/delete/${board.id}`,
                      );
                      router.push("/board/list");
                    } catch (error) {
                      console.error("Error deleting board:", error);
                    }
                  }
                }}
              >
                삭제
              </Button>
            </Box>
          )}
        </Paper>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => router.push("/board/list")}
        >
          목록으로 돌아가기
        </Button>
      </Box>
    </Container>
  );
};

export default BoardDetailPage;
