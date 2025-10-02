import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Welcome.tsx"),
  route("ChoiceRG", "routes/ChoiceRG.tsx"),
  route("dashboard", "routes/Dashboard.tsx"),
] satisfies RouteConfig;
