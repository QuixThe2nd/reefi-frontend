import * as React from "react";

import App from "./App";
import ReactDOM from "react-dom/client";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.querySelector("#root")!).render(<React.StrictMode><App /></React.StrictMode>);
// ReactDOM.createRoot(document.querySelector('#root') as HTMLElement).render(<App />)
