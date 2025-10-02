import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Welcome.tsx"),
  route("ChoiceRG", "routes/ChoiceRG.tsx"),
] satisfies RouteConfig;
