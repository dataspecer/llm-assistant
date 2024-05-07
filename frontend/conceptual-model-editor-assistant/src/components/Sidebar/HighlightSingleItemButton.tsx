import { Button, IconButton, Tooltip } from "@mui/material"
import HighlightIcon from '@mui/icons-material/Highlight';
import { isShowHighlightDialogState, isShowTitleDialogDomainDescriptionState, originalTextIndexesListState, selectedSuggestedItemState, tooltipsState } from "../../atoms";
import { useSetRecoilState } from "recoil";
import { Attribute, Field, Item, ItemType, Relationship } from "../../interfaces";
import { SIDEBAR_BUTTON_COLOR, SIDEBAR_BUTTON_SIZE, capitalizeString } from "../../hooks/useUtility";


interface Props
{
    item: Item
}

const HighlightSingleItemButton: React.FC<Props> = ({ item }): JSX.Element =>
{
    const setSelectedSuggestedItem = useSetRecoilState(selectedSuggestedItemState)
    const setIsShowHighlightDialog = useSetRecoilState(isShowHighlightDialogState)
    const setOriginalTextIndexesList = useSetRecoilState(originalTextIndexesListState)
    const setTooltips = useSetRecoilState(tooltipsState)
    const setIsShowTitleDialogDomainDescription = useSetRecoilState(isShowTitleDialogDomainDescriptionState)


    const onHighlightSingleItem = () =>
    {
        setIsShowTitleDialogDomainDescription(true)
        setIsShowHighlightDialog(_ => true)
        setSelectedSuggestedItem(_ => item)
        setOriginalTextIndexesList(_ => item[Field.ORIGINAL_TEXT_INDEXES])
    
        // Create tooltips for highlighted original text
        let tooltip = ""
        const capitalizedSourceEntity: string = capitalizeString((item as Attribute).source)
    
        if (item.type === ItemType.ENTITY)
        {
            tooltip = `Entity: ${item.name}`
        }
        else if (item.type === ItemType.ATTRIBUTE)
        {
            tooltip = `${capitalizedSourceEntity}: ${item.name}`
        }
        else if (item.type === ItemType.RELATIONSHIP)
        {
            tooltip = `${capitalizedSourceEntity} - ${item.name} - ${(item as Relationship).target}`
        }
    
        let newTooltips : string[] = Array(item.originalTextIndexes.length).fill(tooltip)
        setTooltips(_ => newTooltips)
    }

    return (
        <Tooltip
            title="Highlight in domain description"
            enterDelay={500}
            leaveDelay={200}>

            <Button
                size={ SIDEBAR_BUTTON_SIZE }
                sx={{ textTransform: "none" }}
                onClick={() => onHighlightSingleItem()}>
                    <HighlightIcon/>
            </Button>
        </Tooltip>
    )
}

export default HighlightSingleItemButton