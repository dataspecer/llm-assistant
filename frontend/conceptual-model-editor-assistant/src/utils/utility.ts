import { SetterOrUpdater } from "recoil";
import { Attribute, Class, Field, Item, ItemType, ItemsMessage, Association, SidebarTabs, UserChoice } from "../interfaces"


export const TOPBAR_DEFAULT_HEIGHT_PX = 361
export const SIDEBAR_DEFAULT_WIDTH_PERCENTAGE = 20

export const SUMMARY_DESCRIPTIONS_NAME = "Summary: descriptions"
export const SUMMARY_PLAIN_TEXT_NAME = "Summary: plain text"


// TODO: It is probably better to use "null" instead of blank item
export const blankClass: Class = {
  [Field.IRI]: "", [Field.TYPE]: ItemType.CLASS, [Field.NAME]: "", [Field.DESCRIPTION]: "", [Field.ORIGINAL_TEXT]: "", [Field.ORIGINAL_TEXT_INDEXES]: []
}

export const blankAttribute: Attribute = {
  [Field.IRI]: "", [Field.NAME]: "", [Field.DESCRIPTION]: "", [Field.DATA_TYPE]: "", [Field.ORIGINAL_TEXT]: "",
  [Field.ORIGINAL_TEXT_INDEXES]: [], [Field.TYPE]: ItemType.ATTRIBUTE, [Field.SOURCE_CARDINALITY]: "",
  [Field.SOURCE_CLASS]: ""
}


export const capitalizeString = (inputString : string) =>
{
  if (!inputString)
  {
    return ""
  }

  return inputString.charAt(0).toUpperCase() + inputString.slice(1)
}


export const clipString = (string: string, maxLength: number): string =>
{
  if (string.length > maxLength)
  {
    const newString = string.substring(0, maxLength) + "..."
    return newString
  }
  return string
}


export const userChoiceToItemType = (userChoice: UserChoice): ItemType =>
{
  if (userChoice === UserChoice.CLASSES)
  {
    return ItemType.CLASS 
  }

  if (userChoice === UserChoice.ATTRIBUTES)
  {
    return ItemType.ATTRIBUTE
  }

  if (userChoice === UserChoice.ASSOCIATIONS_ONE_KNOWN_CLASS || userChoice === UserChoice.ASSOCIATIONS_TWO_KNOWN_CLASSES)
  {
    return ItemType.ASSOCIATION
  }

  throw Error(`Unexpected user choice: ${userChoice}`)
}


export const itemTypeToUserChoice = (itemType: ItemType): UserChoice =>
{
  if (itemType === ItemType.CLASS)
  {
    return UserChoice.CLASSES
  }
  else if (itemType === ItemType.ATTRIBUTE)
  {
    return UserChoice.ATTRIBUTES
  }
  else if (itemType === ItemType.ASSOCIATION || itemType === ItemType.GENERALIZATION)
  {
    return UserChoice.ASSOCIATIONS_ONE_KNOWN_CLASS
  }

  throw Error(`Received unknown item type: ${itemType}`)
}


export const createErrorMessage = (item: Item, setErrorMessage: SetterOrUpdater<string>): void =>
{
  let message = ""

  if (item.type === ItemType.CLASS)
  {
    message = `Class "${item.name}" already exists`
  }
  else if (item.type === ItemType.ATTRIBUTE)
  {
    message = `Class "${(item as Attribute)[Field.SOURCE_CLASS]}" already contains attribute "${item.name}"`
  }
  else if (item.type === ItemType.ASSOCIATION)
  {
    message = `Association in between source class "${(item as Association)[Field.SOURCE_CLASS]}" and target class "${(item as Association)[Field.TARGET_CLASS]}" already exists`
  }

  setErrorMessage(message)
}


export const changeTitle = (userChoice: UserChoice, sourceItemName: string, targetItemName: string, setTitle: any): void =>
{
  if (userChoice === UserChoice.CLASSES)
  {
    const message = ""
    setTitle((title: ItemsMessage) => { return { ...title, entities: message} })
  }
  else if (userChoice === UserChoice.ATTRIBUTES)
  {
    const message = `Selected class: ${sourceItemName}`
    setTitle((title: ItemsMessage) => { return { ...title, attributes: message} })
  }
  else if (userChoice === UserChoice.ASSOCIATIONS_ONE_KNOWN_CLASS)
  {
    const message = `Selected class: ${sourceItemName}`
    setTitle((title: ItemsMessage) => { return { ...title, associations: message} })
  }
  else if (userChoice === UserChoice.ASSOCIATIONS_TWO_KNOWN_CLASSES)
  {
    const message = `Source class: ${sourceItemName}\nTarget class: ${targetItemName}`
    setTitle((title: ItemsMessage) => { return { ...title, associations: message} })
  }
}


export const onClearSuggestedItems = (itemType: ItemType, setSuggestedEntities: any, setSuggestedAttributes: any, setSuggestedRelationships: any): void =>
{
  if (itemType === ItemType.CLASS)
  {
    setSuggestedEntities([])
  }
  else if (itemType === ItemType.ATTRIBUTE)
  {
    setSuggestedAttributes([])
  }
  else if (itemType === ItemType.ASSOCIATION)
  {
    setSuggestedRelationships([])
  }
}


export const changeSidebarTab = (itemType: ItemType, setSidebarTab: any) =>
{
  if (itemType === ItemType.CLASS)
  {
    setSidebarTab(SidebarTabs.CLASSES)
  }
  else if (itemType === ItemType.ATTRIBUTE)
  {
    setSidebarTab(SidebarTabs.ATTRIBUTES)
  }
  else if (itemType === ItemType.ASSOCIATION || itemType === ItemType.GENERALIZATION)
  {
    setSidebarTab(SidebarTabs.ASSOCIATIONS)
  }
  else
  {
    throw Error(`Received unknown item type: ${itemType}`)
  }
}