import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Welcome.tsx"),
  // Keuze scherm
  route("Choice", "routes/Choice.tsx"),
  
  // Doneren routes
  route("doneren/dashboard", "routes/donate/Dashboard.tsx"),

  // Ontvangen routes
  route("ontvangen/dashboard", "routes/receive/Dashboard.tsx"),
] satisfies RouteConfig;
