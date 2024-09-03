import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import App from './App';
import {
    RouterProvider,
    createMemoryRouter,
} from "react-router-dom";
import routes from "./utils/routes.js";

const testPage = async (path) => {
    const router = createMemoryRouter(routes, {
        initialEntries: [path],
    });

    render(<RouterProvider router={router} />);
    const notFound = screen.queryByText("This page does not exist");
    await expect(notFound).not.toBeInTheDocument();
}

describe('Routing', () => {
    afterAll(() => {
        cleanup()
    })

    it("Should have the home page at path /", async () => await testPage("/"));
    it("Should have the waiting page at path /waiting", async () => await testPage("/waiting"));
    it("Should have the game page at path /game", async () => await testPage("/game"));
    it("Should have the ranking page at path /ranking", async () => await testPage("/ranking"));
});

/*
describe('Waiting page', () => {
    it("Should display the number of players connected and ready", () => {
        
        const io = new Server({
        cors: {
        origin: "http://localhost:3000"
        }});
        io.on("ready", () => {
            io.emit("playersConnected", {nbReady: 21, nbPlayers: 45});
        })

        io.listen(4000);

        render(<Router>);
        const btn = screen.getByText("Ready?");
        fireEvent.click(btn);
        const playersConnected = screen.queryByText("21/45 player(s) ready");
    
        expect(playersConnected).toBeInTheDocument();
    });
});
*/


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