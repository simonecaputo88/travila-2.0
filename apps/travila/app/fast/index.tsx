"use client";

import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import ImageIcon from "@mui/icons-material/Image";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import StarBorderRounded from "@mui/icons-material/StarBorderRounded";
import MapOutlined from "@mui/icons-material/MapOutlined";
import Thermostat from "@mui/icons-material/Thermostat";
import WaterDropOutlined from "@mui/icons-material/WaterDropOutlined";
import LanguageOutlined from "@mui/icons-material/LanguageOutlined";
import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import Groups2Outlined from "@mui/icons-material/Groups2Outlined";
import FlightTakeoffOutlined from "@mui/icons-material/FlightTakeoffOutlined";
import MuseumOutlined from "@mui/icons-material/MuseumOutlined";
import RoomOutlined from "@mui/icons-material/RoomOutlined";

import { VictoryChart, VictoryLine, VictoryBar, VictoryAxis, VictoryTheme, VictoryTooltip } from "victory";

// UI (tuoi)
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import Card from "../../components/ui/Card";
import PrimaryButton from "../../components/ui/PrimaryButton";

// Form (tuoi)
import TextField from "../../components/form/TextField";
import Select from "../../components/form/Select";
import LanguageToggle from "../../components/form/LanguageToggle";

// NOTE: non cambiamo l'API. Adegua l'URL se nel tuo progetto è diverso.
async function fetchFast(city: string) {
  const res = await fetch(`/api/itinerary-fast?city=${encodeURIComponent(city)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Errore fetch");
  return res.json();
}

function TabPanel({ value, index, children }: { value: number; index: number; children: React.ReactNode }) {
  if (value !== index) return null;
  return <Box sx={{ pt: 2 }}>{children}</Box>;
}

export default function FastItineraryPage() {
  const [uiLang, setUiLang] = React.useState<"it" | "en">("it");
  const [query, setQuery] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<any | null>(null);
  const [tab, setTab] = React.useState(0);
  const [openPoi, setOpenPoi] = React.useState<string | null>(null);

  const cityName = data?.city?.name || "La tua città";
  const country = data?.city?.country || "";
  const image =
    data?.city?.image ||
    "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1600&auto=format";
  const population = data?.city?.population;
  const language = data?.language || "—";
  const currency = data?.currency || "—";

  const months =
    data?.weather?.months || ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
  const temp = data?.weather?.avgTempC || [8, 9, 12, 15, 18, 22, 26, 29, 24, 18, 12, 9];
  const rain = data?.weather?.precipMM || [50, 42, 40, 45, 55, 35, 25, 30, 60, 80, 70, 60];
  type ChartPoint = { month: string; temp: number; rain: number };
  const chartData: ChartPoint[] = months.map((m: string, i: number) => ({ month: m, temp: temp[i], rain: rain[i] }));


  const highlights: string[] = data?.highlights || [];
  const poi: any[] = data?.poi || [];
  const cuisine: { name: string; note: string }[] = data?.cuisine || [];
  const tips: { label: string; text: string }[] = data?.tips || [];

  async function onSearch() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const raw = await fetchFast(query.trim());
      setData(mapApiToUi(raw));
    } catch (e) {
      console.error(e);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  // Adapter neutro (non cambia il backend!)
  function mapApiToUi(api: any) {
    return {
      city: {
        name: api?.city?.name || api?.destination?.name || api?.name || "—",
        country: api?.city?.country || api?.destination?.country || api?.country || "—",
        lat: api?.city?.lat ?? api?.lat ?? null,
        lon: api?.city?.lon ?? api?.lon ?? null,
        population: api?.city?.population ?? api?.population ?? null,
        image: api?.city?.image || api?.image || null,
      },
      highlights: api?.highlights || api?.topHighlights || [],
      poi: (api?.poi || api?.pointsOfInterest || []).map((p: any, i: number) => ({
        id: p.id ?? String(i),
        title: p.title || p.name || "POI",
        image: p.image || p.photo || "",
        description: p.description || p.desc || "",
        coords: p.coords || (p.lat && p.lon ? [p.lat, p.lon] : null),
      })),
      weather: {
        months: api?.weather?.months || months,
        avgTempC: api?.weather?.avgTempC || api?.weather?.temperature || temp,
        precipMM: api?.weather?.precipMM || api?.weather?.precipitation || rain,
      },
      cuisine: api?.cuisine || api?.food || [],
      language: api?.language || api?.lang || "—",
      currency: api?.currency || "EUR",
      tips: api?.tips || [],
    };
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Header sticky con info tooltip a destra */}
      <Header
        right={
          <Tooltip title="Inserisci la città e genera l'Itinerario Fast. La logica dati non cambia.">
            <IconButton>
              <InfoOutlined />
            </IconButton>
          </Tooltip>
        }
      />

      {/* Form in alto */}
      <Box sx={{ borderBottom: "1px solid", borderColor: "divider", py: 2 }}>
        <Container>
          {/* CSS Grid responsive al posto di Grid MUI */}
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "7fr 2fr 3fr" },
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <TextField
                label="Destinazione"
                placeholder="Es. Barcellona"
                value={query}
                onChangeText={(t: string) => setQuery(t)}
              />
            </Box>

            <Box>
              <LanguageToggle
                label="Lingua UI"
                value={uiLang}
                onChange={(v: "it" | "en") => setUiLang(v)}
              />
            </Box>

            <Box>
              <PrimaryButton onClick={onSearch} loading={isLoading} fullWidth>
                Genera Itinerario
              </PrimaryButton>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero */}
      <Container sx={{ mt: 3 }}>
        <Box
          sx={{
            position: "relative",
            height: { xs: 260, md: 360 },
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: 2,
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.35)" }} />
          <Box sx={{ position: "absolute", bottom: 0, p: { xs: 2, md: 3 }, color: "#fff" }}>
            <Typography variant="h3" sx={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
              {cityName}
              {country ? `, ${country}` : ""}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
              {population && (
                <Chip
                  icon={<Groups2Outlined />}
                  variant="outlined"
                  label={`${population.toLocaleString("it-IT")} abitanti`}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.25)",
                    color: "white",
                    borderColor: "rgba(255,255,255,0.4)",
                  }}
                />
              )}
              {language && (
                <Chip
                  icon={<LanguageOutlined />}
                  variant="outlined"
                  label={language}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.25)",
                    color: "white",
                    borderColor: "rgba(255,255,255,0.4)",
                  }}
                />
              )}
              {currency && (
                <Chip
                  icon={<PaymentsOutlined />}
                  variant="outlined"
                  label={currency}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.25)",
                    color: "white",
                    borderColor: "rgba(255,255,255,0.4)",
                  }}
                />
              )}
            </Stack>
          </Box>
        </Box>
      </Container>

      <Container sx={{ py: 4 }}>
        {/* Highlights + Map: 2 colonne responsive via CSS Grid */}
        <Box
          sx={{
            display: "grid",
            gap: 24 / 8, // 3
            gridTemplateColumns: { xs: "1fr", md: "7fr 5fr" },
          }}
        >
          {/* Highlights */}
          <Card
            headerTitle={
              <Stack direction="row" alignItems="center" spacing={1}>
                <StarBorderRounded color="primary" />
                <span>Highlights imperdibili</span>
              </Stack>
            }
          >
            {isLoading ? (
              <Box
                sx={{
                  display: "grid",
                  gap: 8 / 8,
                  gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr" },
                }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <Box key={i} sx={{ height: 36, bgcolor: "action.hover", borderRadius: 2 }} />
                ))}
              </Box>
            ) : highlights.length ? (
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {highlights.map((h, idx) => (
                  <Chip key={idx} label={h} icon={<StarBorderRounded />} variant="outlined" />
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">
                Inserisci una città per scoprire i must-see.
              </Typography>
            )}
          </Card>

          {/* Mappa */}
          <Card
            headerTitle={
              <Stack direction="row" alignItems="center" spacing={1}>
                <MapOutlined color="primary" />
                <span>Anteprima mappa</span>
              </Stack>
            }
          >
            <Box
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                height: 260,
                display: "grid",
                placeItems: "center",
                bgcolor: "grey.50",
              }}
            >
              {data?.city?.lat && data?.city?.lon ? (
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    {data.city.lat.toFixed(4)}, {data.city.lon.toFixed(4)}
                  </Typography>
                  <Chip label="Mappa interattiva (placeholder)" variant="outlined" />
                </Box>
              ) : (
                <Typography color="text.secondary">Coordinate non disponibili</Typography>
              )}
            </Box>
          </Card>
        </Box>

        {/* POI Carousel */}
        <Box sx={{ mt: 3 }}>
          <Card
            headerTitle={
              <Stack direction="row" alignItems="center" spacing={1}>
                <ImageIcon color="primary" />
                <span>Luoghi da vedere</span>
              </Stack>
            }
          >
            {isLoading ? (
              <Box
                sx={{
                  display: "grid",
                  gap: 16 / 8,
                  gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
                }}
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <Box key={i} sx={{ height: 160, bgcolor: "action.hover", borderRadius: 2 }} />
                ))}
              </Box>
            ) : poi.length ? (
              <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
                {poi.map((p) => (
                  <Box
                    key={p.id}
                    sx={{
                      minWidth: 260,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: 144,
                        bgcolor: "grey.100",
                        backgroundImage: `url(${p.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <Box sx={{ p: 2 }}>
                      <Typography variant="subtitle1" noWrap>
                        {p.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ height: 40, overflow: "hidden" }}
                      >
                        {p.description}
                      </Typography>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ mt: 1 }}
                      >
                        {p?.coords ? (
                          <Chip
                            size="small"
                            label={`${p.coords[0]?.toFixed?.(2)}, ${p.coords[1]?.toFixed?.(2)}`}
                            icon={<RoomOutlined />}
                            variant="outlined"
                          />
                        ) : (
                          <span />
                        )}
                        <PrimaryButton
                          variant="outlined"
                          onClick={() => setOpenPoi(p.id)}
                          size="small"
                        >
                          Dettagli
                        </PrimaryButton>
                      </Stack>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">I punti di interesse appariranno qui.</Typography>
            )}
          </Card>

          {/* POI Dialog */}
          <Dialog open={!!openPoi} onClose={() => setOpenPoi(null)} maxWidth="md" fullWidth>
            <DialogTitle>Dettagli luogo</DialogTitle>
            <DialogContent dividers>
              {(() => {
                const p = poi.find((x) => x.id === openPoi);
                if (!p)
                  return <Typography color="text.secondary">Nessun dettaglio.</Typography>;
                return (
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      alignItems: "start",
                    }}
                  >
                    <Box
                      sx={{
                        height: 220,
                        borderRadius: 2,
                        bgcolor: "grey.100",
                        backgroundImage: `url(${p.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <Box>
                      <Typography variant="h6">{p.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {p.description}
                      </Typography>
                      {p?.coords && (
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
                          <RoomOutlined fontSize="small" />
                          <Typography variant="body2">
                            {p.coords[0]}, {p.coords[1]}
                          </Typography>
                        </Stack>
                      )}
                    </Box>
                  </Box>
                );
              })()}
            </DialogContent>
          </Dialog>
        </Box>

        {/* Meteo: Tabs + Charts */}
        <Box sx={{ mt: 3 }}>
          <Card
            headerTitle={
              <Stack direction="row" alignItems="center" spacing={1}>
                <MapOutlined color="primary" />
                <span>Meteo annuale</span>
              </Stack>
            }
          >
            <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="primary" indicatorColor="primary">
              <Tab icon={<Thermostat fontSize="small" />} iconPosition="start" label="Temperature medie (°C)" />
              <Tab icon={<WaterDropOutlined fontSize="small" />} iconPosition="start" label="Precipitazioni (mm)" />
            </Tabs>

            <TabPanel value={tab} index={0}>
              <Box sx={{ width: "100%" }}>
                <VictoryChart height={320} theme={VictoryTheme.material} domainPadding={15}>
                  <VictoryAxis tickValues={chartData.map(d => d.month)} style={{ tickLabels: { angle: 0, fontSize: 10 } }} />
                  <VictoryAxis dependentAxis label="°C" style={{ axisLabel: { padding: 30 } }} />
                  <VictoryLine
                    data={chartData}
                    x="month"
                    y="temp"
                    labels={({ datum }) => `${datum.temp} °C`}
                    labelComponent={<VictoryTooltip />}
                  />
                </VictoryChart>
              </Box>
            </TabPanel>

            <TabPanel value={tab} index={1}>
              <Box sx={{ width: "100%" }}>
                <VictoryChart height={320} theme={VictoryTheme.material} domainPadding={20}>
                  <VictoryAxis tickValues={chartData.map(d => d.month)} style={{ tickLabels: { angle: 0, fontSize: 10 } }} />
                  <VictoryAxis dependentAxis label="mm" style={{ axisLabel: { padding: 30 } }} />
                  <VictoryBar
                    data={chartData}
                    x="month"
                    y="rain"
                    labels={({ datum }) => `${datum.rain} mm`}
                    labelComponent={<VictoryTooltip />}
                    cornerRadius={4}
                  />
                </VictoryChart>
              </Box>
            </TabPanel>

          </Card>
        </Box>

        {/* Cucina + Info pratiche: 2 colonne responsive */}
        <Box
          sx={{
            display: "grid",
            gap: 24 / 8,
            gridTemplateColumns: { xs: "1fr", md: "7fr 5fr" },
            mt: 1,
          }}
        >
          <Card headerTitle={<>Piatti tipici</>}>
            {cuisine.length ? (
              <Box
                sx={{
                  display: "grid",
                  gap: 16 / 8,
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                }}
              >
                {cuisine.map((c, idx) => (
                  <Box key={idx} sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                    <Typography fontWeight={600}>{c.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {c.note}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">Aggiungeremo qui le specialità locali.</Typography>
            )}
          </Card>

          <Card headerTitle={<>Info pratiche</>}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LanguageOutlined fontSize="small" />
                <Typography color="text.secondary">Lingua:</Typography>
                <Typography fontWeight={600}>{language}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PaymentsOutlined fontSize="small" />
                <Typography color="text.secondary">Valuta:</Typography>
                <Typography fontWeight={600}>{currency}</Typography>
              </Stack>
              {population && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Groups2Outlined fontSize="small" />
                  <Typography color="text.secondary">Abitanti:</Typography>
                  <Typography fontWeight={600}>{population.toLocaleString("it-IT")}</Typography>
                </Stack>
              )}
              {data?.city?.lat && data?.city?.lon && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <RoomOutlined fontSize="small" />
                  <Typography color="text.secondary">Coordinate:</Typography>
                  <Typography fontWeight={600}>
                    {data.city.lat.toFixed(4)}, {data.city.lon.toFixed(4)}
                  </Typography>
                </Stack>
              )}
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "grid",
                gap: 12 / 8,
                gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr" },
              }}
            >
              <PrimaryButton variant="outlined" fullWidth startIcon={<FlightTakeoffOutlined />}>
                Come arrivare
              </PrimaryButton>
              <PrimaryButton variant="outlined" fullWidth startIcon={<MuseumOutlined />}>
                Pass & Museum
              </PrimaryButton>
            </Box>
          </Card>
        </Box>

        {/* Pro tips */}
        <Box sx={{ mt: 3 }}>
          <Card headerTitle="Pro tips per il viaggio">
            {tips.length ? (
              <Box
                sx={{
                  display: "grid",
                  gap: 16 / 8,
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                }}
              >
                {tips.map((t, idx) => (
                  <Box key={idx} sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t.label}
                    </Typography>
                    <Typography fontWeight={600}>{t.text}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">I consigli utili appariranno qui.</Typography>
            )}
          </Card>
        </Box>

        <Box sx={{ textAlign: "center", color: "text.secondary", fontSize: 12, py: 4 }}>
          Travila – Itinerario Fast UI • React + MUI • Logica dati invariata • (No Grid)
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}
