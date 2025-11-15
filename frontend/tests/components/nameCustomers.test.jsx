import { render, screen, fireEvent } from "@testing-library/react";
import NameCustomers from "../../src/components/Vehicles/nameCustomers";
import axios from "axios";
// eslint-disable-next-line no-undef
vi.mock("axios");
// eslint-disable-next-line no-undef
describe("Test Select Customer Name", () => {
    // eslint-disable-next-line no-undef
    test("renders customers and calls onSelect", async () => {
        // eslint-disable-next-line no-undef
        axios.get.mockResolvedValue({
            data: {
                data: {
                    customers: [
                        { _id: "1", name: "Karim" },
                        { _id: "2", name: "Omar" },
                    ],
                },
            },
        });
        // eslint-disable-next-line no-undef
        const mockFn = vi.fn();
        render(<NameCustomers onSelect={mockFn} />);
        const option = await screen.findByText("Karim");
        // eslint-disable-next-line no-undef
        expect(option).toBeInTheDocument();
        const select = screen.getByRole("combobox");
        fireEvent.change(select, { target: { value: "2" } });
        // eslint-disable-next-line no-undef
        expect(mockFn).toHaveBeenCalledWith("2");
    });
});
