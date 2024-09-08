import Rte from "@components/grid/controls/rte";
import { Dispatch, SetStateAction } from "react";
import BasicDialog from "./basicDialog";

export type AlertDialogModel = {
    message: string,
    setter: Dispatch<SetStateAction<string>>
}

export default function AlertDialog({message, setter}: AlertDialogModel) {
    const formatAlert = (message: string) => {
        if (message.startsWith('<')) {
            return <Rte text={message} />
        }
        return <p>{message}</p>
    }
    return (
        <BasicDialog open={!!message} size="sm" onClose={() => setter('')}>
            {formatAlert(message)}
        </BasicDialog>
    )
}