import React from 'react';
import { createRoot } from 'react-dom/client';

const Hello = () => {
   return <div className="flex h-screen items-center">
      <main className="w-full bg-gray-800 text-white text-2xl font-bold p-4 text-center">
         <h1>Hello, world!</h1>
      </main>
   </div>;
};

void (async () => {
   console.log("Booting client...");

   const container = document.getElementById('reactor')!;
   const root = createRoot(container);
   root.render(<Hello />);
})();
