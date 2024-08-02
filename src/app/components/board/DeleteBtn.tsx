import React from "react";
import { Button } from "@mui/material";
import { backend_api } from "@/app/utils";

interface DeleteButtonProps {
  boardId: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  boardId,
  onSuccess,
  onError,
}) => {
  const handleDelete = async () => {
    try {
      await backend_api().delete(`/api/board/delete/${boardId}`);
      onSuccess();
    } catch (error) {
      onError("게시글을 삭제하는 데 오류가 발생했습니다.");
      console.error("Error deleting board:", error);
    }
  };

  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={() => {
        if (confirm("정말로 삭제하시겠습니까?")) {
          handleDelete();
        }
      }}
    >
      삭제
    </Button>
  );
};

export default DeleteButton;
