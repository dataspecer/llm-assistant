import AutoFixNormalIcon from "@mui/icons-material/AutoFixNormal"
import { CircularProgress, IconButton, Stack } from "@mui/material"
import { useRecoilValue, useSetRecoilState } from "recoil"
import useGenerateSingleField from "../../hooks/useGenerateSingleField"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import useConfirmRegeneratedField from "../../hooks/useConfirmRegeneratedField"
import { onClearRegeneratedItem } from "../../utils/editItem"
import { useEffect } from "react"
import { fieldToLoadState, regeneratedItemState } from "../../atoms/suggestions"
import { Item, Association } from "../../definitions/conceptualModel"
import { Field, ItemType } from "../../definitions/utility"
import { createNameFromIRI } from "../../utils/conceptualModel"


interface Props
{
    item: Item
    field: Field
    isRegeneratedText: boolean
    isDisabledFieldSuggestion: boolean
}


const Suggestion: React.FC<Props> = ({ item, field, isRegeneratedText, isDisabledFieldSuggestion }) =>
{
    const fieldToLoad = useRecoilValue(fieldToLoadState)
    const setRegeneratedItem = useSetRecoilState(regeneratedItemState)
    
    const { onGenerateField } = useGenerateSingleField()
    const { onConfirmRegeneratedText } = useConfirmRegeneratedField()


    const handleGenerateField = (): void =>
    {
        let sourceClass = (item as Association)[Field.SOURCE_CLASS]

        if (item[Field.TYPE] === ItemType.CLASS)
        {
            sourceClass = item[Field.IRI]
        }

        if (sourceClass)
        {
            sourceClass = createNameFromIRI(sourceClass)
        }

        let targetClass = (item as Association)[Field.TARGET_CLASS]

        if (targetClass)
        {
            targetClass = createNameFromIRI(targetClass)
        }

        sourceClass = sourceClass ?? ""
        targetClass = targetClass ?? ""

        const description = item[Field.DESCRIPTION] ?? ""
        const originalText = item[Field.ORIGINAL_TEXT] ?? ""

        onGenerateField(item[Field.TYPE], item[Field.NAME], description, originalText, sourceClass, targetClass, field)
    }


    const handleSuggestionConfirmation = (): void =>
    {
        onConfirmRegeneratedText(field)
    }


    const handleSuggestionRejection = (): void =>
    {
        onClearRegeneratedItem(field, setRegeneratedItem)
    }


    // Clear the generated suggestion when the component is unmounted
    useEffect(() =>
    {
        return () => { onClearRegeneratedItem(field, setRegeneratedItem) }
    }, [field, setRegeneratedItem])


    // Let user confirm or reject given suggestion
    if (isRegeneratedText)
    {
        return (
            <Stack direction="row">

                <IconButton onClick={ handleSuggestionConfirmation }>
                    <CheckIcon color="success"/>
                </IconButton>

                <IconButton onClick={ handleSuggestionRejection }>
                    <CloseIcon color="error"/>
                </IconButton>

            </Stack>
        )
    }


    const isShowLoadingIndicator = fieldToLoad.includes(field)
    if (isShowLoadingIndicator)
    {
        return (
            <CircularProgress sx={{ position: "relative", right: "3px", top: "5px" }} size={ "30px" } />
        )
    }


    // Show icon for generating new suggestion
    return (
        <IconButton
            disabled={isDisabledFieldSuggestion}
            color="primary"
            size="small"
            onClick={ handleGenerateField }>
                <AutoFixNormalIcon/>
        </IconButton>
    )
}

export default Suggestion