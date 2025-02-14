import { render, screen } from "@testing-library/react";
import { Hello } from "./hello";
import "@testing-library/jest-dom";

describe("Hello", () => {
   it("should say hello", () => {
      // [SPEC] The Hello component displays a Hello message.
      render(<Hello />);

      const hello = screen.getByText(/hello/i);

      expect(hello).toBeInTheDocument();
   });

   it("has a dark gray text background", () => {
      // [SPEC] The Hello component has a dark gray background.
      render(<Hello />);

      const main = screen.getByRole("main");

      expect(main).toHaveClass("bg-gray-800");
   });
});
