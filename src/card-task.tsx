import { useDisclosure } from "@nextui-org/modal";
import { Task } from "./setting";
import DetailTask from "./detail-task";

type Props = {
  task: Task;
  fetch: () => Promise<void>;
  path: string[] | null;
  data:Task[] | null;
  open:boolean;
};
function Card({ task, fetch, path, data, open }: Props): JSX.Element {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  return (
    <div className="flex space-x-5  items-center  w-[80%]">
      <h1 className="text-xs font-bold w-[15px] px-2">{task.description}</h1>
      <>
        {path && path.includes(task.id) ? (
          <div className="flex flex-col">
            {open && (
              <button
                onClick={onOpen}
                className="bg-yellow-600 h-auto relative"
                style={{
                  left: task.latestStart +`${1}px` ,
                  width: task.duration +`${1}px` ,
                }}
              >
                <p className="text-[10px]  text-center text-white">
                  {task.duration}
                </p>
              </button>
            )}
            <button
              onClick={onOpen}
              className="bg-red-600 h-auto relative"
              style={{ left: task.start +`${1}px` , width: task.duration +`${1}px`  }}
            >
              <p className="text-[10px]  text-center text-white">
                {task.duration}
              </p>
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            {open && (
              <button
                onClick={onOpen}
                className="bg-yellow-600 h-auto relative"
                style={{
                  left: task.latestStart +`${1}px` ,
                  width: task.duration +`${1}px` ,
                }}
              >
                <p className="text-[10px]  text-center text-white">
                  {task.duration}
                </p>
              </button>
            )}

            <button
              onClick={onOpen}
              className="bg-blue-600 h-auto relative"
              style={{ left: task.start +`${1}px` , width: task.duration +`${1}px`  }}
            >
              <p className="text-[10px]  text-center text-white">
                {task.duration}
              </p>
            </button>
          </div>
        )}
      </>
      <DetailTask
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        modif={task}
        fetch={fetch}
        items={data}
      />
    </div>
  );
}

export default Card;
