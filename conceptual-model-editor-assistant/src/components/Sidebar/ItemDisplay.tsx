import { ListItemText, Stack, Typography } from "@mui/material"
import { Attribute, Field, Item, ItemFieldUIName, ItemType, Relationship } from "../../interfaces"
import ControlButtons from "./ControlButtons"

interface Props
{
    item: Item
}


const ItemDisplay: React.FC<Props> = ({ item }): JSX.Element =>
{
    const attribute : Attribute = (item as Attribute)
    const relationship : Relationship = (item as Relationship)

    const isAttribute = item.type === ItemType.ATTRIBUTE
    const isRelationship = item.type === ItemType.RELATIONSHIP

    // Display original text in gray color if generated original text was not found in domain description
    const customLightGray = "#b5b5b5"
    let originalTextColor = customLightGray

    if (item[Field.ORIGINAL_TEXT_INDEXES])
    {
        originalTextColor = item[Field.ORIGINAL_TEXT_INDEXES].length === 0 ? customLightGray : "black"
    }


    return (
        <Stack marginTop={"15px"}>
            <Typography> <strong>{ ItemFieldUIName.NAME }:</strong> { item[Field.NAME] } </Typography>

            {
                item[Field.ORIGINAL_TEXT] &&
                    <Typography color={originalTextColor}> <strong>{ ItemFieldUIName.ORIGINAL_TEXT }:</strong> { item[Field.ORIGINAL_TEXT] } </Typography>
            }

            {
                item[Field.DESCRIPTION] &&
                    <Typography> <strong>{ ItemFieldUIName.DESCRIPTION }:</strong> { item[Field.DESCRIPTION] } </Typography>
            }

            {
                isAttribute && attribute[Field.DATA_TYPE] &&
                    <Typography> <strong>{ ItemFieldUIName.DATA_TYPE }:</strong> { attribute[Field.DATA_TYPE] } </Typography>
            }

            {
                isAttribute && attribute[Field.SOURCE_CARDINALITY] &&
                    <Typography> <strong>{ ItemFieldUIName.CARDINALITY }:</strong> { attribute[Field.SOURCE_CARDINALITY] } </Typography>
            }

            {
                isRelationship && relationship[Field.SOURCE_ENTITY] &&
                    <Typography> <strong> { ItemFieldUIName.SOURCE_ENTITY }:</strong> { relationship[Field.SOURCE_ENTITY] } </Typography>
            }

            {
                isRelationship && relationship[Field.TARGET_ENTITY] &&
                    <Typography> <strong> { ItemFieldUIName.TARGET_ENTITY }:</strong> { relationship[Field.TARGET_ENTITY] } </Typography>
            }

            {
                isRelationship && relationship[Field.SOURCE_CARDINALITY] &&
                    <Typography> <strong> { ItemFieldUIName.SOURCE_CARDINALITY }:</strong> { relationship[Field.SOURCE_CARDINALITY] } </Typography>
            }

            { isRelationship && relationship[Field.TARGET_CARDINALITY] &&
                    <Typography> <strong> { ItemFieldUIName.TARGET_CARDINALITY }:</strong> { relationship[Field.TARGET_CARDINALITY] } </Typography>
            }
        </Stack>
    )
}

export default ItemDisplay