import { useDisclosure } from "@nextui-org/modal";
import AddTask from "./add-task";
import { Task } from "./setting";
type props={
  fetch:()=>Promise<void>;
  data:Task[] | null;
  setShow:React.Dispatch<React.SetStateAction<boolean>>;
  show:boolean;
}
export default function Nav({fetch,data,setShow,show}:props): JSX.Element {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  return (
    <>
      <nav className="flex items-center space-x-5">
        <button onClick={onOpen} className="px-2 py-1 rounded-md bg-green-800 text-white text-xs">
          Add Task
        </button>
        <button onClick={()=>setShow(!show)} className="px-2 py-1 rounded-md bg-yellow-800 text-white text-xs">
          Show marging
        </button>
        <button onClick={()=>window.location.reload()} className="px-2 py-1 rounded-md bg-blue-800 text-white text-xs">
          Refresh
        </button>
      </nav>
      <AddTask fetchTask={fetch}  isOpen={isOpen} onOpenChange={onOpenChange} items={data}/>
    </> 
  );
}
