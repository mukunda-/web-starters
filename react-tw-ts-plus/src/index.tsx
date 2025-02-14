import { createRoot } from "react-dom/client";
import { Hello } from "./hello";

void (async () => {
   console.log("Booting client...");

   const container = document.getElementById("reactor")!;
   const root = createRoot(container);
   root.render(<Hello />);
})();
