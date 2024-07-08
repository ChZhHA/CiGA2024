import { createRoot } from "react-dom/client";
import PlayArea from "./playArea";
import HangupArea from "./hangupArea";
const root = createRoot(document.body);
root.render(<App />);

function App() {
    return (
        <div className="root">
            <div className="title">拖动这里</div>
            <PlayArea />
            <HangupArea />
        </div>
    );
}
