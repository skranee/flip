import React from 'react'
import MainPage from "./mainPage/mainPage";
import LeftPanel from "./mainPage/leftPanel/leftPanel";
import FaqBeneath from "./faqBeneath";
import Chat from "./chat/chat";

function App() {
  return (
    <div>
        <MainPage />
        <LeftPanel />
        <FaqBeneath />
        <Chat />
    </div>
  );
}

export default App;
