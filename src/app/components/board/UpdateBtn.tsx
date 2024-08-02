import React from "react";
import { Button } from "@mui/material";
import { backend_api } from "@/app/utils";

interface UpdateButtonProps {}

const UpdateButton: React.FC<UpdateButtonProps> = ({}) => {
  return (
    <Button
      variant="contained"
      color="primary"
      sx={{ mr: 1 }}
      onClick={() => {}}
    >
      수정
    </Button>
  );
};

export default UpdateButton;
