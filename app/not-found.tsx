import React from "react";
import Navbar from "@/components/ui/Navbar";
import NotFoundScreen from "@/components/ui/NotFoundScreen";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Navbar />
      <NotFoundScreen />
    </div>
  );
}
