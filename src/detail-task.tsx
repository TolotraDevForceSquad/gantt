import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  DeleteTask,
  FormTask,
  ModifOneTask,
  Task
} from "./setting";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
  modif: Task;
  fetch: () => Promise<void>;
  items:Task[] | null
};
export default function Details({
  isOpen,
  onOpenChange,
  modif,
  fetch,
  items
}: Props): JSX.Element {
  const [values, setValues] = useState<string[]>(modif.dependencies);
  const { register, control, handleSubmit } = useForm<FormTask>();

  async function handleDelete(id: string) {
    await DeleteTask(id).then();
    await fetch();
  }

  const onSubmit: SubmitHandler<FormTask> = async (data) => {
    await ModifOneTask(modif, data, values);
    await fetch();
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent className="w-fit">
        {(onClose) => (
          <>
            <ModalHeader>Task Detail</ModalHeader>
            <form
              className="p-4 flex flex-col space-y-4 items-start"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                {...register("description", { required: true })}
                label="description"
                isRequired
                defaultValue={modif.description}
                size="sm"
              />

              <Input
                {...register("duration", {
                  validate: (value) => !isNaN(value) || "Enter a number value",
                })}
                label="Duree "
                defaultValue={modif.duration.toString()}
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
                      placeholder="tâches précédentes"
                      selectedKeys={values}
                      onSelectionChange={setValues}
                    >
                      {items
                        .filter((item) => item.id !== modif.id)
                        .map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.description}
                          </SelectItem>
                        ))}
                    </Select>
                  )}
                />
              )}
              <ModalFooter className="flex items-center space-between">
                <Button
                  color="danger"
                  variant="flat"
                  onClick={() => handleDelete(modif.id)}
                  onPress={onClose}
                >
                  Supprimer
                </Button>
                <Button color="primary" type="submit" onPress={onClose}>
                  Modifier
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
