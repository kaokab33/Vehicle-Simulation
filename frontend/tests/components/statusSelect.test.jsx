import { render, screen ,fireEvent} from '@testing-library/react'
import StatusSelect from '../../src/components/Vehicles/statusSelect';
// eslint-disable-next-line no-undef
describe("Test Status Select",()=>{
    // eslint-disable-next-line no-undef
    test("calls onSelect when a status is chosen", () => {
       // eslint-disable-next-line no-undef
       const  mockFn=vi.fn();
        render(<StatusSelect onSelect={mockFn}/>);
        const select = screen.getByRole('combobox');
        fireEvent.change(select,{target:{value:"Connected"}});
        // eslint-disable-next-line no-undef
        expect(mockFn).toHaveBeenCalledWith("Connected");
    });
})