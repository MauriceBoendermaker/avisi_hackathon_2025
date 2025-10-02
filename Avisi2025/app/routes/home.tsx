import type { Route } from "./+types/home";
import Navbar from "../src/components/nav/Navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Avisi Hackthon 2025" },
    { name: "description", content: "Avisi 2025" },
  ];
}

export default function Home() {
  return <Navbar />;
}
