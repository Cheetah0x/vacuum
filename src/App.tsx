import { Vacuum } from './components/vacuum/vacuum'
import { VacuumWizard } from './components/vacuum/vacuumMain'
import { WalletProvider } from './providers/RainbowKitProvider'

function App() {
  return (
    <WalletProvider>
      <VacuumWizard />
      {/* <Vacuum /> */}
    </WalletProvider>
  )
}

export default App
