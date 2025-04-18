import { Task } from "./setting";

type Props = {
  tasks: Task[];
};
export default  function Table({ tasks }: Props) {
  return (
    <div className="w-[100%] mx-auto  flex flex-row items-start">
      <div className="flex px-1 border  flex-col w-[150px]">
        <h1 className="font-bold font-mono ">Tache</h1>
        <h1 className="font-bold font-mono ">duree</h1>
        <h2 className="font-bold font-mono ">Tot</h2>
        <h1 className="font-bold font-mono ">Tard</h1>
        <h1 className="font-bold font-mono ">Marge</h1>
      </div>
      {tasks &&
        tasks.map((task) => (
          <div
            key={task.id}
            className="w-[50px]  px-1 border items-center flex flex-col"
          >
            <h1 className="font-bold font-mono ">{task.description}</h1>
            <h1 className="font-bold font-mono ">{task.end}</h1>
            <h2 className="font-bold font-mono ">{task.start}</h2>
            <h2 className="font-bold font-mono ">{task.latestStart}</h2>
            <h2 className="font-bold font-mono ">
              {task.latestStart - task.start}
            </h2>
          </div>
        ))}
    </div>
  );
}
