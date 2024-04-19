import { ChangeEvent } from "react";
import Button from "@mui/material/Button";
import UploadIcon from '@mui/icons-material/Upload';
import { useSetRecoilState } from "recoil";
import { importedFileNameState } from "../../atoms";
import { ConceptualModelJson } from "../../interfaces";


interface Props
{
    onImport: (conceptualModelJson: ConceptualModelJson) => void
}


const ImportJSONButton: React.FC<Props> = ({ onImport }) =>
{
    const setImportedFileName = useSetRecoilState(importedFileNameState)


    const handleFileUpload = (changeEvent: ChangeEvent<HTMLInputElement>) =>
    {
        if (!changeEvent.target.files)
        {
            return
        }
        const file = changeEvent.target.files[0]


        if (file.name.length < 5 || file.name.slice(-5) != ".json")
        {
            const alertMessage = "Invalid file extension"
            alert(alertMessage)
            return   
        }


        const reader = new FileReader()
        reader.onload = (event) =>
        {
            if (!event?.target?.result)
            {
                return
            }

            const { result } = event.target
            let jsonObject = JSON.parse(result as string)
            onImport(jsonObject)
        }
        reader.readAsText(file)

        setImportedFileName(_ => file.name.slice(0, -5))

        // Clear the file name so the "onChange" handler fires again even when the same file is uploaded more than once
        changeEvent.target.value = ""
    }

    return (
        <Button
            variant="contained"
            color="secondary"
            disableElevation
            sx={{ textTransform: "none" }}
            startIcon={ <UploadIcon/> }
            component="label"
        >
            Import from JSON
            <input
                type="file"
                accept=".json"
                hidden
                onChange={ handleFileUpload }
            />
        </Button>
    )
}

export default ImportJSONButton