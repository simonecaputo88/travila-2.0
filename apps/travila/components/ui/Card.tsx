import * as React from "react";
import MUICard from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

type Props = React.ComponentProps<typeof MUICard> & {
  headerTitle?: React.ReactNode;
  headerAction?: React.ReactNode;
};

export default function Card({ headerTitle, headerAction, children, ...rest }: Props) {
  return (
    <MUICard elevation={2} sx={{ borderRadius: 3 }} {...rest}>
      {headerTitle && <CardHeader title={headerTitle} action={headerAction} />}
      <CardContent>{children}</CardContent>
    </MUICard>
  );
}

export { CardContent, CardActions, CardHeader };
