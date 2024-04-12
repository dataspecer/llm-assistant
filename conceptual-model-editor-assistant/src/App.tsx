import ConceptualModel from './components/ConceptualModel';
import Topbar from './components/Topbar'
import SideBar from './components/Sidebar';
import { ReactFlowProvider } from 'reactflow';
import HighlightDialog from './components/DialogDomainDescription';
import DialogEditItem from './components/DialogEditItem';
import DialogCreateEdge from './components/DialogCreateEdge';
import { RecoilRoot } from 'recoil';


function App()
{
  return (
    <RecoilRoot>
      <Topbar/>

      <ConceptualModel/>

      <SideBar/>

      <HighlightDialog/>

      <DialogEditItem/>

      <DialogCreateEdge/>
    </RecoilRoot>
  );
}


export default App;