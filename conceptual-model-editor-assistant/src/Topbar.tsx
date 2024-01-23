
interface props {
    handleIgnoreDomainDescriptionChange : () => void,
    onPlusButtonClick : (event : React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    onSummaryButtonClick : () => void,
    summaryData : SummaryObject[],
    capitalizeString : (string : string) => string,
    domainDescription : string,
    setDomainDescription : React.Dispatch<React.SetStateAction<string>>,
    inferenceIndexes : number[][]
}

const Topbar: React.FC<props> = ({handleIgnoreDomainDescriptionChange, onPlusButtonClick, onSummaryButtonClick, summaryData, capitalizeString,
    domainDescription, setDomainDescription, inferenceIndexes}) =>
{
    const FormateSummaryObject = (entityObject : SummaryObject) =>
    {
        return (
            <li>
                <p><strong>{capitalizeString(entityObject.entity)}</strong></p>
                <ul>
                    <li>
                        <strong>Attributes</strong>
                        <ul>
                            {entityObject.attributes.map((attribute : Attribute, index : number) =>
                                <li key={`${attribute.name}-${index}`}>
                                    <strong>{attribute.name}</strong>: {attribute.description}
                                </li>
                                )
                            }
                        </ul>
                    </li>

                    <li>
                        <strong>Relationships</strong>
                        <ul>
                            {entityObject.relationships.map((relationship : Relationship, index : number) =>
                                <li key={`${relationship.name}-${index}`}>
                                    <strong>{relationship.name}</strong>: {relationship.description}
                                </li>
                                )
                            }
                        </ul>
                    </li>
                </ul>
            </li>
        )
    }


    const FormatSummary = () =>
    {
        return (
            <ol>
                    {summaryData.map((object : SummaryObject, index : number) =>
                        (   <span key={`${object.entity}-${index}`}>
                                {FormateSummaryObject(object)}
                            </span>
                        ))
                    }
            </ol>
        )
    }

    // Function generated by ChatGPT-3 -- probably very ineffective
    const removeDuplicates = (arr: number[][]): number[][] =>
    {
        return arr.filter((value, index, self) => 
        {
            // Check if the current array is the first occurrence of its content
            return (index === self.findIndex((innerArr) => innerArr[0] === value[0] && innerArr[1] === value[1]));
        });
    };

    function removeOverlappingInferenceIndexes(inferenceIndexes : number[][])
    {
        let indexesToRemove : number[] = []

        for (let i = 0; i < inferenceIndexes.length; i++)
        {
            for (let j = 0; j < inferenceIndexes.length; j++)
            {
                if (i === j)
                {
                    continue
                }

                if (inferenceIndexes[i][0] <= inferenceIndexes[j][0] && inferenceIndexes[i][1] >= inferenceIndexes[j][1])
                {
                    indexesToRemove.push(j)
                }
            }
        }

        const result = inferenceIndexes.filter((_ : any, index : number) => !indexesToRemove.includes(index))
        return result
    }

    const formatHighlights = () =>
    {
        inferenceIndexes = removeDuplicates(inferenceIndexes);

        // For simplicity make every inference index of length 2
        let newInferenceIndexes = []
        for (let i = 0; i < inferenceIndexes.length; i++)
        {
            if (inferenceIndexes[i].length === 2)
            {
                newInferenceIndexes.push(inferenceIndexes[i])
            }
            else if (inferenceIndexes[i].length > 2)
            {
                for (let j = 0; j < inferenceIndexes[i].length; j += 2)
                {
                    const firstInferenceIndex = inferenceIndexes[i][j]
                    const secondInferenceIndex = inferenceIndexes[i][j + 1]
                    const newInferenceIndex = [firstInferenceIndex, secondInferenceIndex]
                    newInferenceIndexes.push(newInferenceIndex)
                }
            }
        }

        newInferenceIndexes = removeOverlappingInferenceIndexes(newInferenceIndexes)

        let sortedInferenceIndexes = newInferenceIndexes.sort(([a, b], [c, d]) => a - c)

        let texts = []
        let lastIndex = 0

        for (let i = 0; i < sortedInferenceIndexes.length; i++)
        {
            const start = domainDescription.slice(lastIndex, sortedInferenceIndexes[i][0])
            // console.log("Start: from: " + lastIndex + " to: " + sortedInferenceIndexes[i][0])
            texts.push(start)
            const mid = domainDescription.slice(sortedInferenceIndexes[i][0], sortedInferenceIndexes[i][1])
            texts.push(mid)
            lastIndex = sortedInferenceIndexes[i][1]
        }

        const end = domainDescription.slice(lastIndex)
        if (end)
        {
            texts.push(end)
        }

        // console.log("Texts: ")
        // console.log(texts)

        return (
            <div>
                {
                    texts.map((text, index) =>
                    (
                        index % 2 === 0 ? <span key={index}>{text}</span> :
                        <span className="highlight" key={index}>{text}
                            {/* How to create a tooltip: https://www.w3schools.com/css/css_tooltip.asp */}
                            <span className="tooltip">Course +name</span>
                        </span>
                    ))
                }
            </div>
        )
    }

    const showDemoHighlightSuggestions = () =>
    {

        // Directly show in domain description
        return <span>We know that <span className="highlightAttributes">courses have a name</span> and a <span className="highlightAttributes">specific number of credits</span>. <span className="highlightRelationships">Each course can have one or more </span><span className="highlightAttributes highlightRelationships">professors</span><span className="highlightAttributes">, who have a name</span>. <span className="highlightRelationships">Professors could participate in any number of courses</span>. <span className="highlightRelationships">For a course to exist, it must aggregate, at least, five students</span>, where <span className="highlightAttributes">each student has a name</span>. <span className="highlightRelationships">Students can be enrolled in any number of courses</span>. Finally, <span className="highlightRelationships">students can be accommodated in dormitories</span>, where <span className="highlightRelationships">each dormitory can have from one to four students</span>. Besides, <span className="highlightAttributes">each dormitory has a price</span>.</span>

        // Show references
        // return <span> Attributes:
        //     <ul>
        //         <li>courses have a name</li>
        //         <li>courses have a specific number of credits</li>
        //         <li>professors, who have a name</li>
        //         <li>each student has a name</li>
        //         <li>each dormitory has a price</li>
        //     </ul>
        //     Relationships:
        //     <ul>
        //         <li>Each course can have one or more professors</li>
        //         <li>Professors could participate in any number of courses</li>
        //         <li>For a course to exist, it must aggregate, at least, five students</li>
        //         <li>Students can be accommodated in dormitories</li>
        //         <li>Students can be enrolled in any number of courses</li>
        //         <li>each dormitory can have from one to four students</li>
        //     </ul>
        //     </span>

    }


    return (
        <div className="topBar">
            <label className="domainDescriptionLabel" htmlFor="story">Domain description: </label>
            <input type="checkbox" id="isIgnoreDomainDescription" defaultChecked onClick={() => handleIgnoreDomainDescriptionChange()}></input>
            <br />
            <br />
            <textarea id="domainDescriptionText" name="story" rows={8} cols={70}
                // https://react.dev/reference/react-dom/components/textarea
                onChange={e => setDomainDescription(e.target.value)}
                value={domainDescription}></textarea>
            <br />
            <br />
            <button className="plusButton" onClick={(event) => onPlusButtonClick(event)}>+Attributes</button>
            <button className="plusButton" onClick={(event) => onPlusButtonClick(event)}>+Relationships</button>
            {/* <button className="plusButton" onClick={() => onSummaryButtonClick()}>Document</button>
            <button className="plusButton">Summary</button>
            {FormatSummary()} */}
            {/* {formatHighlights()} */}
            {/* {showDemoHighlightSuggestions()} */}
        </div>
    )
}

export default Topbar;