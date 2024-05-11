import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import { nodesState, selectedSuggestedItemState } from "../atoms"
import { useRecoilValue } from "recoil"
import { Node } from 'reactflow';
import { Association, Field, Item, ItemFieldUIName } from "../interfaces"
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from "react"
import useEditItemDialog from "../hooks/useEditItemDialog"
import { createNameFromIRI, doesNodeAlreadyExist } from "../utils/conceptualModel"


interface Props
{
    fieldName: Field
    association: Association
    editedItem: Item
}

const ClassListSelector: React.FC<Props> = ({ fieldName, association, editedItem}) =>
{
    const nodes: Node[] = useRecoilValue(nodesState)
    const selectedAssociation: Association = useRecoilValue(selectedSuggestedItemState) as Association

    const [value, setValue] = useState((association as any)[fieldName])
    const fieldUIName = fieldName == Field.SOURCE_CLASS ? ItemFieldUIName.SOURCE_CLASS : ItemFieldUIName.TARGET_CLASS
    
    const { onItemEdit } = useEditItemDialog()

    const iri = fieldName === Field.SOURCE_CLASS ? selectedAssociation[Field.SOURCE_CLASS] : selectedAssociation[Field.TARGET_CLASS]
    const name = createNameFromIRI(iri)

    const handleChange = (event: SelectChangeEvent) =>
    {
        setValue(event.target.value)
        onItemEdit(fieldName, event.target.value)
    }
    
    // Documentation: https://mui.com/material-ui/react-select/#props
    return (
        <FormControl fullWidth variant="standard">
                <InputLabel>{ fieldUIName }</InputLabel>
                <Select
                    value={value}
                    onChange={handleChange}
                >
                    { !doesNodeAlreadyExist(nodes, iri) && <MenuItem value={iri}> {name} </MenuItem>}
                    
                    { nodes.map((node: Node) => <MenuItem key={node.id} value={node.id}> {node.data.class[Field.NAME]} </MenuItem>) }
                </Select>
            </FormControl>
    )
}

export default ClassListSelector