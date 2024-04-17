import Box from '@mui/material/Box';
import { Divider } from "@mui/material";
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { useRecoilValue } from "recoil";
import { sidebarWidthPercentageState, topbarTabValueState } from "../../atoms";
import SummaryDescriptionsTab from "./SummaryDescriptionsTab";
import SummaryPlainTextTab from "./SummaryPlainTextTab";
import TopbarButtons from "./ControlButtons";
import SettingsTab from "./SettingsTab";
import Tabs from "./Tabs";


const Topbar: React.FC = () =>
{
    const tabValue = useRecoilValue(topbarTabValueState)

    const sidebarWidthPercentage = useRecoilValue(sidebarWidthPercentageState)
    const offset = 0.4 // For some reason the topbar's right side does not end exactly where the sidebar starts
    const topBarWidth = 100 - sidebarWidthPercentage + offset
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
                    <SettingsTab/>
                </TabPanel>
            </TabContext>
        </Box>
    )
}

export default Topbar