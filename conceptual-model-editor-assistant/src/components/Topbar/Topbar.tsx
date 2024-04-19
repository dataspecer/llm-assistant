import Box from '@mui/material/Box';
import { Divider } from "@mui/material";
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { sidebarWidthPercentageState, topbarTabValueState } from "../../atoms";
import SummaryDescriptionsTab from "./SummaryDescriptionsTab";
import SummaryPlainTextTab from "./SummaryPlainTextTab";
import TopbarButtons from "./ControlButtons";
import SettingsTab from "./SettingsTab";
import Tabs from "./Tabs";
import ImportTab from './ImportTab';



const Topbar: React.FC = () =>
{
    const tabValue = useRecoilValue(topbarTabValueState)

    const sidebarWidthPercentage = useRecoilValue(sidebarWidthPercentageState)
    const topBarWidth = 100 - sidebarWidthPercentage
    const heightPx = 361


    return (
        <Box sx={{ width: `${topBarWidth}%`, height: `${heightPx}px`, overflow: 'auto' }}>

            <TabContext value={tabValue}>
                
                <Tabs/>

                <TabPanel value="0">
                    <TopbarButtons/>
                </TabPanel>

                <TabPanel value="1">
                    <SummaryPlainTextTab/>
                </TabPanel>

                <TabPanel value="2">
                    <SummaryDescriptionsTab/>                    
                </TabPanel>

                <TabPanel value="3">
                    <ImportTab/>
                </TabPanel>

                <TabPanel value="4">
                    <SettingsTab/>
                </TabPanel>
            </TabContext>
        </Box>
    )
}

export default Topbar