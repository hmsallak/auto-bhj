"use client";

import { useEffect } from "react";

export default function VehicleViewTracker({ reference }) {
  useEffect(() => {
    window.dataLayer?.push?.({ event: "autobhj_vehicle_view", reference });
    window.dispatchEvent(
      new CustomEvent("autobhj:vehicle-view", {
        detail: { reference, at: new Date().toISOString() },
      })
    );
  }, [reference]);

  return null;
}
