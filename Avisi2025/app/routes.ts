import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Welcome.tsx"),
  route("receiver", "routes/DB-Receivers.tsx"),
  route("gifter", "routes/DB-Gifters.tsx"),
  route("dashboard", "routes/Dashboard.tsx"),
  route("choicerg", "routes/ChoiceRG.tsx"),
] satisfies RouteConfig;
