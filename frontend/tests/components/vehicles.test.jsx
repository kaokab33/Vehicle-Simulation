import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Vehicles from "../../src/components/Vehicles/vehicles";
import axios from "axios";

vi.mock("axios");

describe("Vehicles Component", () => {
// beforeEach(() => {
//   vi.useFakeTimers();
// });

// afterEach(() => {
//   vi.restoreAllMocks();
//   vi.clearAllTimers();
// });


  test("fetches and displays vehicles without filters", async () => {
    axios.get.mockImplementation((url) => {
    if (url.includes("/vehicles")) {
      return Promise.resolve({
        data: {
          data: {
            vehicles: [
              { _id: "v1", vin: "111", regNr: "AAA", status: "Connected" },
              { _id: "v2", vin: "222", regNr: "BBB", status: "Connected" },
            ],
          },
        },
      });
    }
    if (url.includes("/customers")) {
      return Promise.resolve({
        data: {
          data: {
            customers: [
              { _id: "c1", name: "Karim" },
              { _id: "c2", name: "Omar" },
            ],
          },
        },
      });
    }
  });


    render(<Vehicles />);

    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:5000/api/v1/vehicles",
      { params: {} }
    );

    expect(await screen.findByText("111")).toBeInTheDocument();
    expect(await screen.findByText("BBB")).toBeInTheDocument();
  });

  test("fetches vehicles filtered by status", async () => {
    axios.get.mockImplementation((url) => {
    if (url.includes("/vehicles")) {
      return Promise.resolve({
        data: {
          data: {
            vehicles: [
              { _id: "v1", vin: "111", regNr: "AAA", status: "Connected" },
              { _id: "v2", vin: "222", regNr: "BBB", status: "Connected" },
            ],
          },
        },
      });
    }
    if (url.includes("/customers")) {
      return Promise.resolve({
        data: {
          data: {
            customers: [
              { _id: "c1", name: "Karim" },
              { _id: "c2", name: "Omar" },
            ],
          },
        },
      });
    }
  });

    render(<Vehicles />);

    // Simulate selecting status
    const statusSelect = screen.getByRole("combobox", { name: /select a status/i });
    fireEvent.change(statusSelect, { target: { value: "Connected" } });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:5000/api/v1/vehicles",
        { params: { status: "Connected" } }
      );
    });

    expect(await screen.findByText("111")).toBeInTheDocument();
  });

// test("fetches vehicles filtered by customerId", async () => {
//   axios.get.mockImplementation((url, config) => {
//     // FIRST CALL → customers list
//     if (url.includes("/customers")) {
//       return Promise.resolve({
//         data: {
//           data: {
//             customers: [
//               { _id: "c1", name: "Karim" },
//               { _id: "c2", name: "Omar" },
//             ],
//           },
//         },
//       });
//     }

//     // SECOND CALL → vehicles for selected customer
//     if (url.includes("/vehicles")) {
//       // If customer is selected return filtered vehicles
//         return Promise.resolve({
//           data: {
//             data: {
//               customer: {
//                 name: "Karim",
//                 _id: "c1",
//                 address: "123 Main St",
//                 vehicles: [
//                   { _id: "v1", vin: "111", regNr: "AAA", status: "Connected" },
//                 ],
//               },
//             },
//           },
//         });
      

//       // default empty vehicles
//       return Promise.resolve({
//         data: { data: { vehicles: [] } },
//       });
//     }
//   });

//   render(<Vehicles />);

//   // Select customer
//   const customerSelect = screen.getByRole("combobox", {
//     name: /select a customer/i,
//   });
//   fireEvent.change(customerSelect, { target: { value: "c1" } });

//   // Ensure vehicles API called with correct params
//   await waitFor(() => {
//     expect(axios.get).toHaveBeenCalledWith(
//       "http://localhost:5000/api/v1/vehicles",
//       { params: { customerId: "c1" } }
//     );
//   });

//   expect(await screen.findByText("123 Main St")).toBeInTheDocument();
//   expect(await screen.findByText("111")).toBeInTheDocument();
// });



test("fetches vehicles filtered by customer and status", async () => {
    axios.get.mockImplementation((url, config) => {
      if (url.includes("/customers")) {
        return Promise.resolve({
          data: {
            data: {
              customers: [
                { _id: "c1", name: "Karim" },
                { _id: "c2", name: "Omar" },
              ],
            },
          },
        });
      }
      if (url.includes("/vehicles")) {
        return Promise.resolve({
          data: {
            data: {
              customer: {
                _id: "c1",
                name: "Karim",
                address: "123 Main St",
                vehicles: [
                  { _id: "v1", vin: "111", regNr: "AAA", status: "Connected" },
                  { _id: "v2", vin: "222", regNr: "BBB", status: "Connected" },
                ],
              },
            },
          },
        });
      }
    });

    render(<Vehicles />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByRole("combobox", { name: /select a customer/i })).toBeInTheDocument();
    });

    const customerSelect = screen.getByRole("combobox", { name: /select a customer/i });
    const statusSelect = screen.getByRole("combobox", { name: /select a status/i });

    
    fireEvent.change(customerSelect, { target: { value: "c1" } });
    
    
    // Then change status
    fireEvent.change(statusSelect, { target: { value: "Connected" } });

    // Wait for the final call with both parameters
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:5000/api/v1/vehicles",
        { params: { customerId: "c1", status: "Connected" } }
      );
    });

    // Verify the content is displayed
    expect(await screen.findByText("111")).toBeInTheDocument();
    expect(await screen.findByText("222")).toBeInTheDocument();
});

  test("displays message when no vehicles found", async () => {


    axios.get.mockImplementation((url, config) => {
      if (url.includes("/customers")) {
        return Promise.resolve({
          data: {
            data: {
              customers: [
                { _id: "c1", name: "Karim" },
                { _id: "c2", name: "Omar" },
              ],
            },
          },
        });
      }
      if (url.includes("/vehicles")) {
        return Promise.resolve({
          data: {
            data: {
              },
            }
        });
      }
    });
    render(<Vehicles />);

    expect(await screen.findByText("No vehicles found.")).toBeInTheDocument();
  });

});
