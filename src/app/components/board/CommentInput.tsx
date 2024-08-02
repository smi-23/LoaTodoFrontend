import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";

interface CommentInputProps {
  onCommentSubmit: (content: string) => void;
}
const CommentInput: React.FC<CommentInputProps> = ({ onCommentSubmit }) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = () => {
    if (newComment.trim()) {
      onCommentSubmit(newComment);
      setNewComment("");
    }
  };
  return (
    <Box mt={4} sx={{ width: "100%" }}>
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        label="댓글을 작성하세요"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        댓글 추가
      </Button>
    </Box>
  );
};
export default CommentInput;
