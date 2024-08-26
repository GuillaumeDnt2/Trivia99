import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import {
    RouterProvider,
    createMemoryRouter,
} from "react-router-dom";
import { act } from "react";
import routes from "./utils/routes.js";

const testPage = async (path) => {
    const router = createMemoryRouter(routes, {
        initialEntries: [path],
    });

    render(<RouterProvider router={router} />);
    const notFound = screen.queryByText("This page does not exist");
    expect(notFound).not.toBeInTheDocument();
}

test("The home page exists at path /", () => testPage("/"));
test("The waiting page exists at path /waiting", () => testPage("/waiting"));
test("The game page exists at path /game", () => testPage("/game"));
test("The ranking page exists at path /ranking", () => testPage("/ranking"));



/*
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});*/

/*
describe('MagicDoor Component', () => {
    let store;
    beforeAll(() => {
        const mockStore = configureStore([]);
        store = mockStore({}); //initial state
    });

    it('should transport to the correct destination on door use', () => {
        const destinationId = '123';
        const destinationLink = `mystery-destination/${destinationId}`;
        render(
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <BrowserRouter>
                        <MagicDoor destinationId={destinationId} />
                    </BrowserRouter>
                </MuiThemeProvider>
            </Provider>,
        );

        const door = screen.getByText('Step through to your destination');
        expect(door).toHaveAttribute('href', destinationLink);

        fireEvent.click(door);
        expect(window.location.pathname).toBe(destinationLink);
    });
});*/