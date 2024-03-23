import { useState } from "react"
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { UserChoice } from "../App";
import Tooltip from '@mui/material/Tooltip';
import { Divider, List, ListItem, ListItemText, Tab, Tabs, Typography } from "@mui/material";
import { Node } from 'reactflow';
import useUtility from "../hooks/useUtility";
import TabPanel from '@mui/lab/TabPanel';
import TabList from "@mui/lab/TabList";
import TabContext from '@mui/lab/TabContext';


interface Props
{
    onIgnoreDomainDescriptionChange : () => void
    isIgnoreDomainDescription : boolean
    onImportButtonClick : () => void
    onPlusButtonClick : (event : React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    onSummaryButtonClick : () => void
    OnClickAddNode : (nodeName : string) => void
    domainDescription : string
    onDomainDescriptionChange : (newDomainDescriptionText : string) => void
    onHighlightSelectedItems : () => void

    isShowSummary1 : boolean
    summary : string
    
    isShowSummary2 : boolean
    selectedNodes : Node[]
}


const Topbar: React.FC<Props> = ({onIgnoreDomainDescriptionChange, onImportButtonClick, onPlusButtonClick, onSummaryButtonClick, domainDescription, OnClickAddNode, onDomainDescriptionChange, onHighlightSelectedItems, summary, isShowSummary1, isShowSummary2, selectedNodes, isIgnoreDomainDescription}) =>
{
    const [tabValue, setTabValue] = useState<string>('0');
    const [insertedNodeNameText, setInsertedNodeNameText] = useState<string>("")

    const { capitalizeString } = useUtility()

    const showSummary1 = () =>
    {
        return (
            <Typography>
                {summary}
            </Typography>
        )
    }

    const showSummary2 = () =>
    {
        // previous implementation: https://github.com/Dominik7131/Conceptual-Modeling-LLM-Assistant/blob/4b71b1e6f62792f586e35b3baac58a4d8d9c10c5/conceptual-model-editor-assistant/src/components/Topbar.tsx
        
        // arguments:
        //  - selected nodes
        //  - selected edges
        // issue: how to distinguish existing descriptions vs. new descriptions that user did not accepted yet?

        // control flow:
        // 1) user selects some part of his conceptual model and clicks on summary2 button
        // 2) from selectedNodes and selectedEdges we obtain list of all selected entities, attributes and relationships
        // 3) for each entity, attribute and relationship: if it does not contain description then save it some object that we will later pass to LLM to generate descriptions
        // 4) send this object to LLM
        // 5) show to the user list of all selected items with their descriptions
        //  - if the description is newly generated from LLM then distinguish it with gray text and add buttons for the user to accept/reject the description
        //      - we know which description is newly generated by checking the object passed to LLM
        //  - otherwise show the description as usual (black text, no buttons)

        return (
                <ol>
                {
                    selectedNodes.map((node) =>
                        <Typography key={node.id} component="span">
                            <li key={node.id}><strong>{capitalizeString(node.id)}</strong>: {node.data.description}</li>
                            <ul>
                                <p></p>
                                <li><strong>Attributes</strong></li>
                                <ul>
                                    {node.data.attributes.map((attribute : Attribute) =>
                                        <li key={attribute.ID}><strong>{attribute.name}</strong>: {attribute.description}</li>
                                    )}
                                </ul>
                            </ul>
                            <p></p>          
                        </Typography>
                    )
                }
                </ol>
        )
    }

    const showMainLayout = () =>
    {
        return (
            <>
                <div className="container">
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    defaultChecked
                                    onClick={() => onIgnoreDomainDescriptionChange()}/>
                                }
                                    label="Use domain description"/>
                    </FormGroup>

                    <Stack spacing={1} direction="row"paddingX={1}>

                        <Button variant="contained" size="small" disableElevation onClick={() => onImportButtonClick()}>
                            Import
                        </Button>

                        <Button variant="contained" size="small" disableElevation>
                            Export
                        </Button>
                    </Stack>
                </div>

                <Box
                    className="domainTextContainers"
                    component="form"
                    sx={{
                    '& .MuiTextField-root': { m: 1, width: '98.9%' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        name="domain description"
                        label="domain description"
                        variant="outlined"
                        disabled={isIgnoreDomainDescription}
                        multiline
                        maxRows={7}
                        onChange={event => onDomainDescriptionChange(event.target.value)}
                        value={domainDescription}
                        spellCheck="false">
                    </TextField>
                </Box >
                
                <div className="container">
                    <Stack
                        direction="row"
                        paddingX={1}
                        spacing={10}
                    >
                        <Stack
                            direction="row"
                            spacing={2}
                        >
                            <Button variant="contained" disableElevation onClick={(event) => onPlusButtonClick(event)}>{UserChoice.ENTITIES}</Button>
                            <Button variant="contained" disableElevation onClick={(event) => onPlusButtonClick(event)}>{UserChoice.ATTRIBUTES}</Button>
                            <Button variant="contained" disableElevation onClick={(event) => onPlusButtonClick(event)}>{UserChoice.RELATIONSHIPS}</Button>
                        </Stack>

                        <Stack
                            direction="row"
                            spacing={2}
                        >
                            <Button variant="contained" disableElevation onClick={onSummaryButtonClick}>Summary1</Button>
                            <Button variant="contained" disableElevation>Summary2</Button>
                            <Button variant="contained" disableElevation onClick={onHighlightSelectedItems}>Highlight</Button>
                        </Stack>
                    </Stack>

                    <Stack
                        direction="row"
                        paddingX={1}
                        spacing={2}
                    >
                        <Button
                            variant="contained"
                            size="small"
                            disableElevation
                            onClick={() => OnClickAddNode(insertedNodeNameText)}>Add node</Button>
                        <TextField variant="standard"
                            placeholder="Insert node name to add"
                            value={insertedNodeNameText}
                            rows={1}
                            onChange={(event) => setInsertedNodeNameText(event.target.value)}>
                        </TextField>
                    </Stack>
                </div>
            </>
        )
    }

    const handleChange = (event: React.SyntheticEvent, newValue: string) =>
    {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ width: '80%', height: '387px', overflow: 'auto', typography: 'body1' }}>
            <TabContext value={tabValue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Main" value="0" />
                        <Tab label="Summary 1" value="1" />
                        <Tab label="Summary 2" value="2" />
                        <Tab label="Settings" value="3" />
                    </TabList>
                </Box>

                <TabPanel value="0">
                    {showMainLayout()}
                </TabPanel>

                <TabPanel value="1">
                    { summary && isShowSummary1 &&
                        <Stack paddingX={1} spacing={2}>
                            { showSummary1()}
                        </Stack>
                    }
                </TabPanel>

                <TabPanel value="2">
                    <Stack paddingX={1} spacing={2}>
                        { showSummary2()}
                    </Stack>
                </TabPanel>

                <TabPanel value="3">
                    <Stack paddingX={1} spacing={2}>
                        <Typography>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox defaultChecked />} label="settings1" />
                            <FormControlLabel control={<Checkbox />} label="settings2" />
                        </FormGroup>
                        </Typography>
                    </Stack>
                </TabPanel>
            </TabContext>
        </Box>
    )
}

export default Topbar;