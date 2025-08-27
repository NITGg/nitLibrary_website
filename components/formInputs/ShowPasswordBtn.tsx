import React from "react";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";

const ShowPasswordBtn = ({
  showNewPassword,
  setShowNewPassword,
  disabled
}: {
  showNewPassword: boolean;
  setShowNewPassword: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
}) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size={"icon"}
      onClick={() => setShowNewPassword(!showNewPassword)}
      disabled={disabled}
      className="absolute end-2 top-1/2 transform -translate-y-1/2"
    >
      {showNewPassword ? (
        <EyeOff className="size-4" />
      ) : (
        <Eye className="size-4" />
      )}
    </Button>
  );
};

export default ShowPasswordBtn;
