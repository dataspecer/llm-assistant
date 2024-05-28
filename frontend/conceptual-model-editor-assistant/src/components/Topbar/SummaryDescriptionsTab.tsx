import { Typography, CircularProgress } from "@mui/material"
import { useRecoilValue } from "recoil"
import { capitalizeString } from "../../utils/utility"
import { Field, UserChoiceSummary } from "../../definitions/utility"
import SummaryReactionButtons from "./SummaryReactionButtons"
import { isLoadingSummaryDescriptionsState } from "../../atoms/loadings"
import { summaryDescriptionsState } from "../../atoms/summary"
import { Attribute } from "../../definitions/conceptualModel"
import { SummaryAttribute, SummaryClass } from "../../definitions/summary"



const SummaryDescriptionsTab: React.FC = (): JSX.Element =>
{
    const summaryDescriptions = useRecoilValue(summaryDescriptionsState)
    const isLoading = useRecoilValue(isLoadingSummaryDescriptionsState)

    const isShowReactionButtons = (summaryDescriptions.classes.length !== 0 || summaryDescriptions.associations.length !== 0) && !isLoading


    return (
        <>
            {
                summaryDescriptions.classes.length > 0 && <Typography>Classes and attributes:</Typography>
            }
            
            <ul>
            {
                summaryDescriptions.classes.map((clss: SummaryClass) =>
                    <Typography component="span">
                        <li>
                            <strong>{ capitalizeString(clss[Field.NAME]) }</strong>: { clss[Field.DESCRIPTION] }
                        </li>
                        { clss.attributes.length > 0 &&
                            <ul>
                                <p></p>
                                <li><strong>Attributes</strong></li>
                                <ul>
                                    { clss.attributes.map((attribute : SummaryAttribute) =>
                                        <li>
                                            <strong>{attribute[Field.NAME]}</strong>: { attribute[Field.DESCRIPTION] }
                                        </li>
                                    )}
                                </ul>
                            </ul>
                        }
                        <p></p>
                    </Typography>
                )
            }

            </ul>

            {
                summaryDescriptions.associations.length > 0 && <Typography>Associations:</Typography>
            }

            <ul>
            {
                summaryDescriptions.associations.map((association) =>
                    <Typography component="span">
                        <li>
                            <strong> { capitalizeString(association[Field.SOURCE_CLASS]) }</strong> {association[Field.NAME]} <strong>{capitalizeString(association[Field.TARGET_CLASS])}</strong>: {association[Field.DESCRIPTION]}
                        </li>
                    </Typography>
                )
            }
            </ul>

            { isLoading && <CircularProgress /> }

            {
                isShowReactionButtons &&
                <SummaryReactionButtons userChoice={UserChoiceSummary.SUMMARY_DESCRIPTIONS} summary={summaryDescriptions} />
            }
        </>
    )
}


export default SummaryDescriptionsTab