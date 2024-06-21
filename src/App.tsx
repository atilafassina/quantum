import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { createEffect } from "solid-js";

import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";

import "./styles.css";

export default function App() {
  createEffect(async () => {
    const hasPermission = await isPermissionGranted();

    if (!hasPermission) {
      const permission = await requestPermission();

      if (permission === "granted") {
        console.log("Permission granted");
        sendNotification({
          title: "Hello from Solid!",
          body: "This is a notification from Solid and Tauri",
        });
      } else {
        console.log("Permission denied");
      }
    } else {
      console.log("Already has permission");
      console.log("sendNotification ");
      sendNotification({
        title: "Hello from Solid!",
        body: "This is a notification from Solid and Tauri",
      });
    }
  });

  return (
    <Router>
      <FileRoutes />
    </Router>
  );
}
