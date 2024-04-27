// import React from 'react'
// import { useRef, useState } from "react";

import { useState } from "react";
import Select from "./components/Select"
import TaskComp from "./components/TaskComp";

const App = () => {

  const filters = ["All", "Todo", "Pending", "Completed"];

  const [filter, setFilter] = useState("");

  const getValue = (value: string) => {
    setFilter(value)
  }

  return (
    <div style={{ fontFamily: "Pixelify Sans" }} className=" flex flex-col h-screen w-screen bg-zinc-900 text-zinc-300">
      <header className="h-20 w-screen bg-zinc-950 flex items-center px-5">
        {/* header */}
        <p className=" text-3xl ">TASK <span className="text-blue-700">NX</span></p>
      </header>
      <section className="h-20 container flex gap-2 items-center px-6">
        <p>Filter :</p>
        <Select getValue={getValue} isDisabled={!false} value="All" options={filters} />
      </section>
      <div className="custom-scrollbar flex-1">
        <main className="px-6 h-full">
          <TaskComp filter={filter} />
        </main>
      </div>
    </div>
  )
}

export default App
