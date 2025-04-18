import { z } from "zod";
import { v4 as uuid4 } from "uuid";

const schemaFormTask = z.object({
  description: z.string(),
  duration: z.number(),
  dependencies: z.array(z.string()),
});
const schemaTask = z.object({
  id: z.string(),
  description: z.string(),
  duration: z.number(),
  start: z.number(),
  end: z.number(),
  dependencies: z.array(z.string()),
  latestStart: z.number(),
});

export type FormTask = z.infer<typeof schemaFormTask>;
export type Task = z.infer<typeof schemaTask>;

export async function getAllTask(): Promise<Task[]> {
  try {
    let data: Task[] = [];
    const res = await fetch("http://localhost:3000/tasks", {
      method: "GET",
    });
    const result = await res.json();
    if (result) {
      data = result;
      return data;
    } else {
      throw new Error("Error while fetching!");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error occured");
  }
}

export async function getOneTask(id: string): Promise<Task> {
  const res = await fetch(`http://localhost:3000/tasks/${id}`, {
    method: "GET",
  });
  const task = await res.json();
  return task;
}
export async function DeleteTask(id: string): Promise<void> {
  const res = await fetch(`http://localhost:3000/tasks/${id}`, {
    method: "DELETE",
  });
  if (res.status === 200) {
    const data: Task[] = await getAllTask();
    await changeTask(id, data);
  }
}
async function changeTask(id: string, data: Task[]) {
  const dataUpdate: Task[] = data.filter((task) =>
    task.dependencies.includes(id)
  );
  for (const task of dataUpdate) {
    const dependeciesTask = task.dependencies.filter(
      (dependencies) => dependencies !== id
    );
    let max = 0;

    for (const id of dependeciesTask) {
      const dependencie: Task = await getOneTask(id);
      max = Math.max(dependencie.end, max);
    }
    task.dependencies = dependeciesTask;
    task.start = max;
    task.end = max + task.duration;
    await updateTask(task);
  }
}
async function modifAllTask(data: Task) {
  const tasks: Task[] = await getAllTask();
  const filterData = tasks.filter((task) =>
    task.dependencies.includes(data.id)
  );
  for (const task of filterData) {
    task.start = data.end;
    task.end = task.duration + data.end;
    await updateTask(task);
  }
}
async function updateTask(task: Task) {
  try {
    await fetch(`http://localhost:3000/tasks/${task.id}`, {
      method: "PUT",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw new Error("Error while updating");
  }
}

export async function AddOneTask(
  data: FormTask,
  values: string[]
): Promise<Task> {
  let max = 0;
  const task: Task = {
    id: "",
    duration: 0,
    dependencies: [],
    description: "",
    start: 0,
    end: 0,
    latestStart: 0,
  };
  for (const id of values) {
    const dependenciesTask = await getOneTask(id);
    max = Math.max(max, dependenciesTask.end);
  }
  for (const id of values) {
    task.dependencies.push(id);
  }
  task.duration = parseInt(data.duration.toString());
  task.start = max;
  task.end = max + task.duration;
  task.description = data.description;
  task.id = uuid4();
  try {
    const res = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res) {
      const result = await res.json();
      return result;
    }
    throw new Error("Error Occured while adding data");
  } catch (error) {
    console.log(error);

    throw new Error("Error Occured while adding data");
  }
}
export async function ModifOneTask(
  data: Task,
  form: FormTask,
  values: string[]
): Promise<void> {
  let max = 0;
  data.dependencies = [];
  for (const id of values) {
    const dependenciesTask = await getOneTask(id);
    max = Math.max(max, dependenciesTask.end);
  }
  for (const id of values) {
    data.dependencies.push(id);
  }
  data.duration = parseInt(form.duration.toString());
  data.start = max;
  data.end = max + data.duration;
  try {
    const res = await fetch(`http://localhost:3000/tasks/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      const values = await res.json();
      await modifAllTask(values);
    } else {
      throw new Error("Error http server not found 404");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error while updating");
  }
}

export async function pathCritique(): Promise<string[]> {
  const data: Task[] = await getAllTask();
  const temp: string[] = [];
  let max = 0;
  for (const task of data) {
    max = Math.max(task.end, max);
  }
  let filterData = data.filter((task) => task.end === max);
  while (filterData.length > 0) {
    const next: Task[] = [];
    const taskDependencies: Task[] = [];
    for (const task of filterData) {
      temp.push(task.id);

      for (const dependencies of task.dependencies) {
        const dependeciesTask = await getOneTask(dependencies);
        taskDependencies.push(dependeciesTask);
      }
      let maxEndInTaskDependencies = 0;
      for (const task of taskDependencies) {
        maxEndInTaskDependencies = Math.max(maxEndInTaskDependencies, task.end);
      }
      const taskDependenciesWithMaxEnd = taskDependencies.filter(
        (task) => task.end === maxEndInTaskDependencies
      );

      for (const task of taskDependenciesWithMaxEnd) {
        next.push(task);
      }
    }
    filterData = next;
  }
  return temp;
}
export async function marging() {
  const tasks: Task[] = await getAllTask();
  for(const t of tasks){
    await resetLatestStart(t);
  }
  let max = 0;
  max = Math.max(...tasks.map((task) => task.end), max);
  const last: Task[] = tasks.filter(
    (task) => !tasks.some((t) => t.dependencies.includes(task.id))
  );
  for (const task of last) {
    await recursive(task, max);
  }
}
async function recursive(task: Task, max: number) {
  if (task.latestStart !== 0) {
    let min = task.latestStart;
    min = Math.min(min, max - task.duration);
    task.latestStart = min;
  } else {
    task.latestStart = max - task.duration;
  }
  await updateTask(task);
  for (const id of task.dependencies) {
    await recursive(await getOneTask(id), task.latestStart);
  }
}
async function resetLatestStart(task: Task) {
  task.latestStart = 0;
  try {
    await fetch(`http://localhost:3000/tasks/${task.id}`, {
      method: "PUT",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
}
