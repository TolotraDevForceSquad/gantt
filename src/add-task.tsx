import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AddOneTask, FormTask, Task, } from "./setting";
import { Modal, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";

type Props = {
  fetchTask: () => Promise<void>;
  isOpen: boolean;
  onOpenChange: () => void;
  items:Task[] | null;
};
function AddTask({ fetchTask,isOpen, onOpenChange,items }: Props) {
  const { register, handleSubmit, control, resetField } = useForm<FormTask>();
  const [values, setValues] = useState<string[]>([]);
  const onSubmit: SubmitHandler<FormTask> = async (data) => {
    const result: Task = await AddOneTask(data, values);
    if (result) {
      resetField("description");
      resetField("duration");
      setValues([]);
      await fetchTask();
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent className="w-fit">
        {(onClose) => (
          <>
            <ModalHeader>Add Task</ModalHeader>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col  p-4 rounded-md w-[300px]  space-y-4 items-start"
            >
              <Input
                {...register("description", { required: true })}
                label="description"
                isRequired
                size="sm"
              />

              <Input
                {...register("duration", {
                  validate: (value) => !isNaN(value) || "Enter a number value",
                })}
                label="Duree "
                isRequired
                size="sm"
              />
              {items && (
                <Controller
                  name="dependencies"
                  control={control}
                  defaultValue={values}
                  render={({ field }) => (
                    <Select
                      {...field}
                      selectionMode="multiple"
                      placeholder="dependencies"
                      onSelectionChange={setValues}
                      selectedKeys={values}
                    >
                      {items.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.description}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              )}
              <ModalFooter className="w-[100%] flex items-stretch">
                <Button color="primary"  type="submit">Add Task</Button>
                <Button color="secondary" onPress={onClose}>Done</Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default AddTask;
