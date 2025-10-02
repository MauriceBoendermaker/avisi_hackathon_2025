import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Welcome.tsx"),
  route("receiver", "routes/DB-Receivers.tsx"),
  route("gifter", "routes/DB-Gifters.tsx"),
  route("choicerg", "routes/ChoiceRG.tsx"),
  
  // Doneren routes
  route("doneren/dashboard", "routes/donate/Dashboard.tsx"),

  // Ontvangen routes
  route("ontvangen/dashboard", "routes/receive/Dashboard.tsx"),
] satisfies RouteConfig;
