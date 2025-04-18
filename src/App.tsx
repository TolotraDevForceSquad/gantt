import Card from "./card-task";
import { useEffect, useState } from "react";
import { Task, getAllTask, marging, pathCritique } from "./setting";
import Table from "./table";
import Nav from "./nav";
function App() {
  const [data, setData] = useState<Task[] | null>(null);
  const [path, setPath] = useState<string[] | null>(null);
  const [show, setShow] = useState(false);
  async function getPath() {
    const temp: string[] = await pathCritique();
    setPath(temp);
  }

  useEffect(() => {
    async function fetchTask() {
      await marging();
      const temp: Task[] = await getAllTask();
      setData(temp);
      await getPath();
    }
    fetchTask();
  }, []);
  async function fetchTask() {
    await marging();
    const temp: Task[] = await getAllTask();
    setData(temp);
    await getPath();
  }
  return (
    <div className="w-[90%] mx-auto p-5">
      <Nav show={show} setShow={setShow} fetch={fetchTask} data={data} />
      <h1 className="font-bold text-xl">Gantt Diagram</h1>
      {data ? (
        data.map((task) => (
          <Card
            open={show}
            key={task.id}
            data={data}
            task={task}
            fetch={fetchTask}
            path={path}
          />
        ))
      ) : (
        <h1 className="text-center font-bold ">loading, please wait </h1>
      )}
      <h1 className="font-bold text-xl">Table</h1>
      {data && <Table tasks={data} />}
    </div>
  );
}

export default App;
