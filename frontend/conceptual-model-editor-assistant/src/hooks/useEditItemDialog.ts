import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { domainDescriptionSnapshotsState, domainDescriptionState, edgesState, editDialogErrorMsgState, editedSuggestedItemState, fieldToLoadState, isIgnoreDomainDescriptionState, isLoadingEditState, isShowEditDialogState, nodesState, regeneratedItemState, selectedSuggestedItemState } from "../atoms"
import { Attribute, EdgeData, Entity, Field, Item, ItemType, NodeData, Relationship, UserChoice } from "../interfaces"
import { Node, Edge } from 'reactflow';
import { EDIT_ITEM_URL, HEADER, SAVE_SUGESTED_SINGLE_FIELD_URL, createEdgeUniqueID, getSnapshotDomainDescription, snapshotDomainDescription } from "./useUtility";
import { useState } from "react";


const useEditItemDialog = () =>
{
    const setIsOpened = useSetRecoilState(isShowEditDialogState)
    const setSelectedSuggestedItem = useSetRecoilState(selectedSuggestedItemState)
    const setEditedSuggestedItem = useSetRecoilState(editedSuggestedItemState)
    const [regeneratedItem, setRegeneratedItem] = useRecoilState(regeneratedItemState)

    const [changedItemName, setChangedItemName] = useState("")

    const setNodes = useSetRecoilState(nodesState)
    const setEdges = useSetRecoilState(edgesState)

    const domainDescription = useRecoilValue(domainDescriptionState)
    const isIgnoreDomainDescription = useRecoilValue(isIgnoreDomainDescriptionState)
    const setFieldToLoad = useSetRecoilState(fieldToLoadState)

    const setErrorMessage = useSetRecoilState(editDialogErrorMsgState)

    const [domainDescriptionSnapshot, setSnapshotDomainDescription] = useRecoilState(domainDescriptionSnapshotsState)


    const onClose = (): void =>
    {
        onClearRegeneratedItem(null, true)
        setIsOpened(_ => false)
        setErrorMessage(_ => "")
    }

    const onSave = (newItem: Item, oldItem: Item): void =>
    {
        if (!newItem.name)
        {
            setErrorMessage(_ => "Name cannot be empty")
            return
        }
    
        setIsOpened(_ => false)
    
        if (newItem.type === ItemType.ENTITY)
        {
            editNodeEntity(newItem as Entity, oldItem as Entity)
        }
        else if (newItem.type === ItemType.ATTRIBUTE)
        {
            editNodeAttribute(newItem as Attribute, oldItem as Attribute)
        }
        else if (newItem.type === ItemType.RELATIONSHIP)
        {
            editEdgeRelationship(newItem as Relationship, oldItem as Relationship)
        }
        else
        {
            alert("Unknown action")
        }
    }

    const onItemEdit = (field: Field, newValue : string) : void =>
    {
        setEditedSuggestedItem((previousItem: Item) =>
        { 
            return { ...previousItem, [field]: newValue }
        })
    }


    const editNodeEntity = (newEntity: Entity, oldEntity: Entity): void =>
    {
        const id: string = oldEntity.name  
    
        if (newEntity.name !== oldEntity.name)
        {
            // Update all edges that connect to the changed source or target entity
            setEdges((edges) => edges.map((currentEdge: Edge) =>
            {
                if (currentEdge.source === oldEntity.name)
                {
                    const newRelationship: Relationship = { ...currentEdge.data.relationship, source: newEntity.name }
                    const newEdgeData: EdgeData = { ...currentEdge.data, relationship: newRelationship }
                    const edgeID = createEdgeUniqueID(newEntity.name, currentEdge.target, currentEdge.data.relationship.name)
                    const updatedEdge: Edge = {
                        ...currentEdge, id:edgeID, source: newEntity.name, data: newEdgeData
                    }

                    return updatedEdge
                }
                else if (currentEdge.target === oldEntity.name)
                {
                    const newRelationship: Relationship = { ...currentEdge.data.relationship, target: newEntity.name }
                    const newEdgeData: EdgeData = { ...currentEdge.data, relationship: newRelationship }
                    const edgeID = createEdgeUniqueID(currentEdge.source, newEntity.name, currentEdge.data.relationship.name)
                    const updatedEdge: Edge = {
                        ...currentEdge, id:edgeID, target: newEntity.name, data: newEdgeData
                    }

                    console.log(updatedEdge)

                    return updatedEdge
                }
                return currentEdge
            }))
        }

        setNodes((nodes: Node[]) => nodes.map((currentNode : Node) =>
        {
            if (currentNode.id === id)
            {
                let newAttributes = currentNode.data.attributes

                // For each attribute update their source entity if the name of the entity changed
                if (currentNode.id !== newEntity.name)
                {                   
                    newAttributes = currentNode.data.attributes.map((attribute: Attribute) =>
                    {
                        return { ...attribute, [Field.SOURCE_ENTITY]: newEntity.name }
                    })
                }


                const newData: NodeData = { ...currentNode.data, entity: newEntity, attributes: newAttributes }
                const newNode: Node = {...currentNode, id: newEntity.name, data: newData}

                return newNode
            }
            else
            {
                return currentNode
            }
        }))
    }
      
      
    const editNodeAttribute = (newAttribute: Attribute, oldAttribute: Attribute): void =>
    {
        const id: string = oldAttribute.source
    
        setNodes((nodes: Node[]) => nodes.map((currentNode: Node) =>
        {
            if (currentNode.id === id)
            {
                const newAttributes = currentNode.data.attributes.map((attribute: Attribute) =>
                {
                    if (attribute.name === oldAttribute.name)
                    {
                        return newAttribute
                    }
                    else
                    {
                        return attribute
                    }
                })

                const newData: NodeData = { ...currentNode.data, attributes: newAttributes}
                const newNode: Node = { ...currentNode, data: newData}
                return newNode
            }
            else
            {
                return currentNode
            }
        }))
    }
    
    
    const editEdgeRelationship = (newRelationship: Relationship, oldRelationship : Relationship): void =>
    {
        // Find the edge to update based on the old ID
        const oldID: string = createEdgeUniqueID(oldRelationship.source, oldRelationship.target, oldRelationship.name)

        console.log("OldID: ", oldID)

        setEdges((edges) => edges.map((currentEdge : Edge) =>
        {
            if (currentEdge.id === oldID)
            {
                const newData: EdgeData = { ...currentEdge.data, relationship: newRelationship }
                const newID = createEdgeUniqueID(newRelationship.source, newRelationship.target, newRelationship.name)
                
                // TODO: Is the user allowed to change source and target?
                // If the source/target does not exist we need to create a new node
                let newEdge: Edge = {
                    ...currentEdge, id: newID, source: newRelationship.source, target: newRelationship.target, data: newData
                }

                console.log("Edited edge: ", newEdge)

                return newEdge
            }
            else
            {
                return currentEdge
            }
        }))
    }


    const onClearRegeneratedItem = (field: Field | null, isClearAll: boolean) : void=>
    {
        if (isClearAll)
        {
            setEditedSuggestedItem({[Field.IRI]: "", [Field.TYPE]: ItemType.ENTITY, [Field.NAME]: "", [Field.DESCRIPTION]: "", [Field.ORIGINAL_TEXT]: "", [Field.ORIGINAL_TEXT_INDEXES]: [], [Field.DATA_TYPE]: "", [Field.SOURCE_CARDINALITY]: "", [Field.TARGET_CARDINALITY]: ""})
            setRegeneratedItem({[Field.IRI]: "", [Field.TYPE]: ItemType.ENTITY, [Field.NAME]: "", [Field.DESCRIPTION]: "", [Field.ORIGINAL_TEXT]: "", [Field.ORIGINAL_TEXT_INDEXES]: [], [Field.DATA_TYPE]: "", [Field.SOURCE_CARDINALITY]: "", [Field.TARGET_CARDINALITY]: ""})
        }

        if (!field)
        {
            return
        }

        setRegeneratedItem((previousRegeneratedItem: Item) =>
        {
            if (previousRegeneratedItem.hasOwnProperty(field))
            {
                return { ...previousRegeneratedItem, [field]: ""}   
            }
            
            return previousRegeneratedItem
        })
    }

    const getSourceEntityFromItem = (item: Item) =>
    {
        if (item[Field.TYPE] === ItemType.ENTITY)
        {
            return item[Field.NAME]
        }
        else
        {
            return (item as Relationship)[Field.SOURCE_ENTITY]
        }
    }


    const saveSingleFieldSuggestion = (field_name: string, field_text: string): void =>
    {
        // Save generated single field to backend

        const currentDomainDescription = getSnapshotDomainDescription(UserChoice.SINGLE_FIELD, domainDescriptionSnapshot)

        const sourceEntity = getSourceEntityFromItem(regeneratedItem)

        const suggestionData = {
            domainDescription: currentDomainDescription, fieldName: field_name, fieldText: field_text,
            userChoice: UserChoice.SINGLE_FIELD, sourceEntity: sourceEntity, isPositive: true
        }

        fetch(SAVE_SUGESTED_SINGLE_FIELD_URL, { method: 'POST', headers: HEADER, body: JSON.stringify(suggestionData)})
    }

    
    const onConfirmRegeneratedText = (field : Field) =>
    {
        setEditedSuggestedItem((editedItem: Item) =>
        {
            // Set type to "any" because Typescript doesn't recognise that we already did the check
            // Otherwise we need to write an if-statement for each field of type Item
            if (regeneratedItem.hasOwnProperty(field))
            {
                return {...editedItem, [field]: (regeneratedItem as any)[field]}
            }
            return editedItem
        })

        saveSingleFieldSuggestion(field, (regeneratedItem as any)[field])

        onClearRegeneratedItem(field, false)
    }
    

    const onGenerateField = (itemType: ItemType, name: string, sourceEntity: string, targetEntity: string, field: Field) =>
    {
        const currentDomainDescription = isIgnoreDomainDescription ? "" : domainDescription
        snapshotDomainDescription(UserChoice.SINGLE_FIELD, currentDomainDescription, setSnapshotDomainDescription)

        let userChoice = UserChoice.ENTITIES

        if (itemType === ItemType.ATTRIBUTE)
        {
            userChoice = UserChoice.ATTRIBUTES 
        }
        else if (itemType === ItemType.RELATIONSHIP)
        {
            userChoice = UserChoice.RELATIONSHIPS
        }

        if (userChoice === UserChoice.ENTITIES)
        {
            sourceEntity = name
        }

        if (!sourceEntity) { sourceEntity = "" }
        if (!targetEntity) { targetEntity = "" }

        const bodyData = JSON.stringify({
            "name": name, "sourceEntity": sourceEntity, "targetEntity": targetEntity, "field": field, "userChoice": userChoice,
            "domainDescription": currentDomainDescription
        })

        setErrorMessage("")
        setFieldToLoad(fieldsToLoad => [...fieldsToLoad, field])
        fetchStreamedDataGeneral(bodyData, field)
    }

    // TODO: Put this fetch-function into a separate file
    const fetchStreamedDataGeneral = (bodyData: any, field: Field) =>
    {
        fetch(EDIT_ITEM_URL, { method: "POST", headers: HEADER, body: bodyData })
        .then(response =>
        {
            const stream = response.body; // Get the readable stream from the response body

            if (stream === null)
            {
                console.log("Stream is null")
                setFieldToLoad(fields => fields.filter(currentField => currentField !== field))
                return
            }

            const reader = stream.getReader()

            const readChunk = () =>
            {
                reader.read()
                    .then(({value, done}) =>
                    {
                        if (done)
                        {
                            console.log("Stream finished")
                            setFieldToLoad(fields => fields.filter(currentField => currentField !== field))
                            return
                        }

                        onProcessStreamedDataGeneral(value, field)
                        
                        readChunk()
                    })
                    .catch(error =>
                    {
                        console.error(error)
                        setFieldToLoad(fields => fields.filter(currentField => currentField !== field))
                    })
            }
            readChunk() // Start reading the first chunk
        })
        .catch(error =>
        {
            console.error(error)
            const message = "Server is not responding"
            setErrorMessage(message)
            setFieldToLoad(fields => fields.filter(currentField => currentField !== field))
        })
    }


    function onProcessStreamedDataGeneral(value: any, field: Field): void
    {
        // Convert the `value` to a string
        var jsonString = new TextDecoder().decode(value)
        console.log(jsonString)
        console.log("\n")

        const parsedData = JSON.parse(jsonString)
        setRegeneratedItem((regeneratedItem) =>
        {
            return {...regeneratedItem, [field]: parsedData[field]}
        })
    }


    const onChangeItemType = (item: Item): void =>
    {
        // If the item is attribute then transform it into relationship
        // Otherwise transform relationsip into attribute

        setErrorMessage(_ => "")
    
        if (item.type === ItemType.ATTRIBUTE)
        {
            const oldAttribute = item as Attribute
        
            const relationship : Relationship = {
                [Field.IRI]: oldAttribute[Field.IRI], [Field.TYPE]: ItemType.RELATIONSHIP, [Field.NAME]: changedItemName, [Field.DESCRIPTION]: oldAttribute.description,
                [Field.ORIGINAL_TEXT]: oldAttribute.originalText, [Field.ORIGINAL_TEXT_INDEXES]: oldAttribute.originalTextIndexes, [Field.SOURCE_ENTITY]: oldAttribute.source,
                [Field.TARGET_ENTITY]: oldAttribute.name, [Field.SOURCE_CARDINALITY]: "", [Field.TARGET_CARDINALITY]: ""
            }
        
            setChangedItemName("")
            setSelectedSuggestedItem(relationship)
            setEditedSuggestedItem(relationship)
        }
        else
        {
            const oldRelationship = item as Relationship
            setChangedItemName(oldRelationship[Field.NAME])
            console.log("Setting")

            const attribute : Attribute = {
                [Field.IRI]: oldRelationship[Field.IRI], [Field.TYPE]: ItemType.ATTRIBUTE, [Field.NAME]: oldRelationship.target, [Field.DESCRIPTION]: oldRelationship.description,
                [Field.DATA_TYPE]: "string", [Field.ORIGINAL_TEXT]: oldRelationship.originalText, [Field.ORIGINAL_TEXT_INDEXES]: oldRelationship.originalTextIndexes,
                [Field.SOURCE_CARDINALITY]: "", [Field.SOURCE_ENTITY]: oldRelationship.source
            }
        
            setSelectedSuggestedItem(attribute)
            setEditedSuggestedItem(attribute)
        }
    }
    

    const onRemove = (item: Item): void =>
    {
        if (item.type === ItemType.ENTITY)
        {
            const nodeID = item.name
            removeNode(nodeID)
        }
        else if (item.type === ItemType.ATTRIBUTE)
        {
            removeNodeAttribute(item as Attribute)
        }
        else if (item.type === ItemType.RELATIONSHIP)
        {
            const relationship: Relationship = (item as Relationship)
            const edgeID = createEdgeUniqueID(relationship.source, relationship.target, relationship.name)
            removeEdge(edgeID)
        }
        else
        {
            alert("Unknown action")
        }
    }

    const removeNode = (nodeID: string): void =>
    {
        setNodes((previousNodes) => previousNodes.filter(node => node.id !== nodeID))
    }
    
    
    const removeEdge = (edgeID: string): void =>
    {
        setEdges((edges: Edge[]) => edges.filter(edge => edge.id !== edgeID))
    }
    
    
    const removeNodeAttribute = (attribute: Attribute): void =>
    {
        const nodeID: string = attribute.source
    
        setNodes((nodes) => nodes.map((currentNode : Node) =>
        {
            if (currentNode.id === nodeID)
            {
                const newAttributes = currentNode.data.attributes.filter((element: Attribute) => element.name !== attribute.name)
                const newData: NodeData = { ...currentNode.data, attributes: newAttributes }
                const newNode = { ...currentNode, data: newData }
                return newNode
            }
            else
            {
                return currentNode
            }
        }))
    }

    return { onSave, onClose, onGenerateField, onRemove, onItemEdit, onConfirmRegeneratedText, onChangeItemType, onClearRegeneratedItem }
}

export default useEditItemDialog