import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Welcome.tsx"),
  route("dashboard", "routes/Dashboard.tsx"),
] satisfies RouteConfig;
