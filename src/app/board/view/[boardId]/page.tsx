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
  TextField,
} from "@mui/material";
import { backend_api } from "@/app/utils";
import DeleteButton from "@/app/components/board/DeleteBtn";
import UpdateButton from "@/app/components/board/UpdateBtn";
import CommentInput from "@/app/components/board/CommentInput";

const BoardDetailPage = () => {
  const { boardId } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [board, setBoard] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [newComment, setNewComment] = useState(""); // 상태 추가

  useEffect(() => {
    const fetchBoardDetail = async () => {
      if (!boardId) return; // boardId가 없으면 요청하지 않음
      try {
        const boardResponse = await backend_api().get(`/api/board/${boardId}`);
        if (boardResponse.data && boardResponse.data.data) {
          setBoard(boardResponse.data.data);
        }

        try {
          const commentResponse = await backend_api().get(
            `/api/comment/all/${boardId}`,
          );
          if (commentResponse.data && commentResponse.data.data) {
            setComments(commentResponse.data.data);
          }
        } catch (commentError) {
          if (commentError.response?.status === 404) {
            setComments([]); // 댓글이 없는 경우 빈 배열로 처리
          } else {
            throw commentError; // 다른 오류는 다시 던져서 상위 catch 블록에서 처리
          }
        }
      } catch (error) {
        setError("게시글과 댓글을 불러오는 데 오류가 발생했습니다.");
        console.error("Error fetching board detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardDetail();
  }, [boardId]);

  const handleCommentSubmit = async (content: string) => {
    try {
      const response = await backend_api().post(
        `/api/comment/create/${boardId}`,
        { content },
      );
      setComments([...comments, response.data.data]); // 댓글 목록 업데이트
    } catch (error) {
      setError("댓글을 추가하는 데 오류가 발생했습니다.");
      console.error("Error adding comment:", error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!board) return <Typography>게시글을 찾을 수 없습니다.</Typography>;

  const isAuthor = session?.user?.username === board.author; // 세션 유저와 게시글 저자 비교

  const handleSuccess = () => {
    router.push("/board/list");
  };

  const handleError = (message: string) => {
    setError(message);
  };

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
              <UpdateButton />
              <DeleteButton
                boardId={boardId}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </Box>
          )}
        </Paper>
        {/* Display comments if available */}
        <Box sx={{ mt: 4, width: "100%" }}>
          <Typography variant="h6" gutterBottom>
            댓글
          </Typography>
          {comments.length === 0 ? (
            <Typography>댓글이 없습니다.</Typography>
          ) : (
            comments.map((comment: any, index: number) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Typography variant="body1">{comment.content}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(comment.createdAt).toLocaleString()}
                </Typography>
              </Paper>
            ))
          )}
          {/* 댓글 입력란 및 제출 버튼 추가 */}
          <Box mt={4} sx={{ width: "100%" }}>
            <CommentInput onCommentSubmit={handleCommentSubmit} />
          </Box>
        </Box>
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
