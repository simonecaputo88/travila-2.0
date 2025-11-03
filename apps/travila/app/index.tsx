"use client";
import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PrimaryButton from "../../../apps/travila/components/ui/PrimaryButton";
import Header from "../../../apps/travila/components/ui/Header";
import Footer from "../../../apps/travila/components/ui/Footer";
import { Link } from "expo-router";

export default function Home() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Container sx={{ flex: 1, display: "grid", placeItems: "center" }}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="h3" fontWeight={800}>Benvenuto su Travila</Typography>
          <Typography color="text.secondary">Scopri il nuovo Itinerario Fast con UI super-wow ✨</Typography>
          <Link href="/fast"><PrimaryButton>Vai all’Itinerario Fast</PrimaryButton></Link>
        </Stack>
      </Container>
      <Footer />
    </Box>
  );
}
