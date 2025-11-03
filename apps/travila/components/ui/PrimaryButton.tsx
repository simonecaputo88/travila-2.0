import * as React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

type Props = React.ComponentProps<typeof Button> & {
  loading?: boolean;
};

export default function PrimaryButton({ loading, children, ...rest }: Props) {
  return (
    <Button
      variant="contained"
      color="primary"
      sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
      {...rest}
      disabled={loading || rest.disabled}
    >
      {loading ? <CircularProgress size={18} sx={{ color: "white" }} /> : children}
    </Button>
  );
}
